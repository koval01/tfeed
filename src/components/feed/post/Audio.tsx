import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Post } from "@/types";

import { Icon28Pause, Icon28Play } from "@vkontakte/icons";
import { Slider } from "@vkontakte/vkui";

import ReactPlayer from "react-player";
import { clamp } from "lodash";
import { cn } from "@/lib/utils";

export const AudioPost = React.memo(({ post }: { post: Post }) => {
    const [playing, setPlaying] = useState(false);
    const [playedFraction, setPlayedFraction] = useState(0);
    const [remainingTime, setRemainingTime] = useState<string>("0:00");
    const [isDragging, setIsDragging] = useState(false);

    const playerRef = useRef<ReactPlayer | null>(null);
    const spectrogramRef = useRef<HTMLDivElement>(null);

    const updateFraction = useCallback((value: number) => {
        const fraction = value / 100;
        setPlayedFraction(fraction);

        if (playerRef.current) {
            const duration = playerRef.current.getDuration();
            const newTime = duration * fraction;
            setRemainingTime(formatTime(duration - newTime));
            playerRef.current.seekTo(fraction, "fraction");
        }
    }, []);

    const handleSpectrogramInteraction = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            if (!spectrogramRef.current) return;

            const rect = spectrogramRef.current.getBoundingClientRect();
            const clientX = 'touches' in event
                ? event.touches[0].clientX
                : event.clientX;

            const relativeX = clientX - rect.left;
            const boundedX = Math.max(0, Math.min(relativeX, rect.width));
            const fraction = boundedX / rect.width;

            updateFraction(fraction * 100);
        },
        [updateFraction]
    );

    const handleMouseDown = useCallback((event: React.MouseEvent) => {
        setIsDragging(true);
        handleSpectrogramInteraction(event);
    }, [handleSpectrogramInteraction]);

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        if (isDragging) {
            handleSpectrogramInteraction(event);
        }
    }, [isDragging, handleSpectrogramInteraction]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTouchStart = useCallback((event: React.TouchEvent) => {
        setIsDragging(true);
        handleSpectrogramInteraction(event);
    }, [handleSpectrogramInteraction]);

    const handleTouchMove = useCallback((event: React.TouchEvent) => {
        if (isDragging) {
            handleSpectrogramInteraction(event);
        }
    }, [isDragging, handleSpectrogramInteraction]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleMouseUp, handleTouchEnd]);

    useEffect(() => {
        let animationFrameId: number | null = null;

        const updatePlayedFractionAndTime = () => {
            if (playerRef.current) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();

                if (duration > 0) {
                    setPlayedFraction(currentTime / duration);
                    setRemainingTime(formatTime(duration - currentTime));
                }
            }
            animationFrameId = requestAnimationFrame(updatePlayedFractionAndTime);
        };

        if (playing) {
            animationFrameId = requestAnimationFrame(updatePlayedFractionAndTime);
        } else if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [playing]);

    if (!post.content.media?.[0] || !(["voice", "audio"].includes(post.content.media[0].type))) {
        return null;
    }

    const media = post.content.media[0];
    const spectrogramData = media.waves ?
        media.waves.split(",").map(Number)
        :
        Array.from({ length: 1e2 }, () => 1);

    const formatTime = (seconds: number): string => {
        const clampedSeconds = clamp(seconds, 0, Infinity);
        const minutes = Math.floor(clampedSeconds / 60);
        const remainingSeconds = Math.floor(clampedSeconds % 60);

        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="block mt-3 mb-0 select-none">
            <button
                className="inline-block float-left size-12 rounded-full bg-[--vkui--color_background_accent]"
                onClick={() => setPlaying(!playing)}
            >
                <div className="flex justify-center m-auto text-[--vkui--color_text_contrast]">
                    {!playing ? <Icon28Play /> : <Icon28Pause />}
                </div>
            </button>
            <div className={cn(
                "ml-[60px] pt-1",
                "max-md:w-full max-md:max-w-[550px]",
                "md:max-lg:w-[calc(100%-80px)]",
                "lg:w-[calc(100%-64px)]"
            )}>
                <div
                    ref={spectrogramRef}
                    className="relative pt-0 mt-0 h-4 overflow-hidden select-none max-sm:hidden cursor-pointer w-full"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                >
                    <div className="block">
                        <div className="absolute h-3.5 leading-[14px] whitespace-nowrap">
                            {spectrogramData.map((value, index) => (
                                <s
                                    key={`audio__s_${post.id}_${index}`}
                                    className={cn(
                                        "inline-block max-lg:w-[3.5px] max-sm:w-0.5 lg:w-[2.5px]",
                                        "pt-1 -mt-1 mr-0.5 rounded-sm align-bottom box-border",
                                        "bg-neutral-300 dark:bg-neutral-600"
                                    )}
                                    style={{ height: `${value * 3}%` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="relative h-[18px] -mt-1 pt-1 overflow-hidden w-0" style={{
                        width: `${playedFraction * 100}%`
                    }}>
                        <div className="absolute h-3.5 leading-[14px] whitespace-nowrap">
                            {spectrogramData.map((value, index) => (
                                <s
                                    key={`audio__s_${post.id}_${index}`}
                                    className={cn(
                                        "inline-block max-lg:w-[3.5px] max-sm:w-0.5 lg:w-[2.5px]",
                                        "mr-0.5 pt-1 -mt-1 rounded-sm align-bottom box-border",
                                        "bg-[--vkui--color_background_accent]"
                                    )}
                                    style={{ height: `${value * 3}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="sm:hidden w-full pr-16">
                    <Slider value={playedFraction * 100} aria-labelledby="basic" onChange={updateFraction} />
                </div>
                <time className="inline-block text-sm leading-[19px] mt-[5px] mb-0.5 text-neutral-500">
                    {!playedFraction ? media.duration.formatted : remainingTime}
                </time>
            </div>
            <div className="hidden absolute">
                <ReactPlayer
                    ref={playerRef}
                    url={media.url}
                    playing={playing}
                    controls={true}
                    width="0"
                    height="0"
                    onEnded={() => {
                        setPlaying(false);
                        updateFraction(0);
                    }}
                />
            </div>
        </div>
    );
});

AudioPost.displayName = "AudioPost";
