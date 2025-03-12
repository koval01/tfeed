import type { Post } from "@/types";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import { useMediaPlayback } from "@/hooks/services/useMediaPlayback";

import { Icon28Pause, Icon28Play } from "@vkontakte/icons";
import { Slider } from "@vkontakte/vkui";

import { cn } from "@/lib/utils";
import { clamp } from "lodash";
import ReactPlayer from "react-player";

type AudioSpectrogramProps = {
    data: number[];
    playedFraction: number;
    onMouseDown: (event: React.MouseEvent) => void;
    onMouseMove: (event: React.MouseEvent) => void;
    onTouchStart: (event: React.TouchEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    spectrogramRef: React.RefObject<HTMLDivElement | null>;
};

const AudioSpectrogram = memo<AudioSpectrogramProps>(
    ({ data, playedFraction, onMouseDown, onMouseMove, onTouchStart, onTouchMove, spectrogramRef }) => (
        <div
            ref={spectrogramRef}
            className="relative pt-0 mt-0 h-4 overflow-hidden select-none max-sm:hidden cursor-pointer w-full"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
        >
            <div className="block">
                <div className="absolute h-3.5 leading-[14px] whitespace-nowrap">
                    {data.map((value, index) => (
                        <s
                            key={`spectrogram-bg-${index}`}
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
            <div
                className="relative h-[18px] -mt-1 pt-1 overflow-hidden w-0"
                style={{ width: `${playedFraction * 100}%` }}
            >
                <div className="absolute h-3.5 leading-[14px] whitespace-nowrap">
                    {data.map((value, index) => (
                        <s
                            key={`spectrogram-fg-${index}`}
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
    )
);

AudioSpectrogram.displayName = "AudioSpectrogram";

type AudioControlsProps = {
    playing: boolean;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

const AudioControls = memo<AudioControlsProps>(({ playing, setPlaying }) => (
    <button
        className="inline-block float-left size-12 rounded-full bg-[--vkui--color_background_accent]"
        onClick={() => setPlaying((prev) => !prev)}
    >
        <div className="flex justify-center m-auto text-[--vkui--color_text_contrast]">
            {!playing ? <Icon28Play /> : <Icon28Pause />}
        </div>
    </button>
));

AudioControls.displayName = "AudioControls";

export const AudioPost = memo(({ post }: { post: Post }) => {
    const [playing, setPlaying] = useState(false);
    const [playedFraction, setPlayedFraction] = useState(0);
    const [remainingTime, setRemainingTime] = useState<string>("0:00");
    const [isDragging, setIsDragging] = useState(false);

    const playerRef = useRef<ReactPlayer | null>(null);
    const spectrogramRef = useRef<HTMLDivElement>(null);

    const { onPlay } = useMediaPlayback(playerRef);

    const formatTime = useCallback((seconds: number): string => {
        const clampedSeconds = clamp(seconds, 0, Infinity);
        const minutes = Math.floor(clampedSeconds / 60);
        const remainingSeconds = Math.floor(clampedSeconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    const updateFraction = useCallback((value: number) => {
        const fraction = value / 100;
        setPlayedFraction(fraction);

        if (playerRef.current) {
            const duration = playerRef.current.getDuration();
            const newTime = duration * fraction;
            setRemainingTime(formatTime(duration - newTime));
            playerRef.current.seekTo(fraction, "fraction");
        }
    }, [formatTime]);

    const handleInteraction = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            if (!spectrogramRef.current) return;

            const rect = spectrogramRef.current.getBoundingClientRect();
            const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
            const relativeX = clientX - rect.left;
            const fraction = clamp(relativeX / rect.width, 0, 1);

            updateFraction(fraction * 100);
        },
        [updateFraction]
    );

    const handleTouchStart = useCallback((event: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true);
        handleInteraction(event);
    }, [handleInteraction]);

    const handleMouseUpOrTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handlePlay = useCallback(() => {
        setPlaying(true);
        onPlay();
    }, [onPlay]);

    const handlePlayPause = useCallback(() => {
        if (playing) {
            setPlaying(false);
            playerRef.current?.getInternalPlayer()?.pause();
        } else {
            setPlaying(true);
            onPlay();
        }
    }, [playing, onPlay]);

    useEffect(() => {
        if (!playing) return;

        const intervalId = setInterval(() => {
            if (playerRef.current) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();
                setPlayedFraction(currentTime / duration);
                setRemainingTime(formatTime(duration - currentTime));
            }
        }, 80);

        return () => clearInterval(intervalId);
    }, [playing, formatTime]);

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUpOrTouchEnd);
        document.addEventListener("touchend", handleMouseUpOrTouchEnd);

        return () => {
            document.removeEventListener("mouseup", handleMouseUpOrTouchEnd);
            document.removeEventListener("touchend", handleMouseUpOrTouchEnd);
        };
    }, [handleMouseUpOrTouchEnd]);

    if (!post.content.media?.[0] || !["voice", "audio"].includes(post.content.media[0].type)) {
        return null;
    }

    const media = post.content.media[0];
    const spectrogramData = media.waves
        ? media.waves.split(",").map(Number)
        : Array.from({ length: 100 }, () => 1);

    return (
        <div className="block mt-3 mb-0 select-none">
            <AudioControls playing={playing} setPlaying={handlePlayPause} />
            <div
                className={cn(
                    "ml-[60px] pt-1",
                    "max-md:w-full max-md:max-w-[550px]",
                    "md:max-lg:w-[calc(100%-80px)]",
                    "lg:w-[calc(100%-64px)]"
                )}
            >
                <AudioSpectrogram
                    data={spectrogramData}
                    playedFraction={playedFraction}
                    onMouseDown={handleTouchStart}
                    onMouseMove={(e) => isDragging && handleInteraction(e)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={(e) => isDragging && handleInteraction(e)}
                    spectrogramRef={spectrogramRef}
                />
                <div className="sm:hidden w-full pr-16">
                    <Slider value={playedFraction * 100} aria-labelledby="basic" onChange={updateFraction} />
                </div>
                <time className="inline-block text-sm leading-[19px] mt-[5px] mb-0.5 text-neutral-600">
                    {!playedFraction ? media.duration.formatted : remainingTime}
                </time>
            </div>
            <ReactPlayer
                ref={playerRef}
                url={media.url}
                playing={playing}
                onPlay={handlePlay}
                onPause={() => setPlaying(false)}
                controls={false}
                width="0"
                height="0"
                onEnded={() => {
                    setPlaying(false);
                    updateFraction(0);
                }}
            />
        </div>
    );
});

AudioPost.displayName = "AudioPost";
