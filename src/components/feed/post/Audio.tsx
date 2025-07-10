import type { Post } from "@/types";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import { useMediaPlayback } from "@/hooks/services/useMediaPlayback";

import { Icon28Pause, Icon28Play } from "@vkontakte/icons";
import { Slider } from "@vkontakte/vkui";

import { cn } from "@/lib/utils/clsx";
import { clamp } from "lodash";

import ReactPlayer from "react-player";

type SpectrogramBarsProps = {
    data: number[];
    className?: string;
    style?: React.CSSProperties;
    barClassName?: string;
};

const SpectrogramBars = memo<SpectrogramBarsProps>(({ data, className, style, barClassName }) => (
    <div className={cn("absolute h-3.5 leading-[14px] whitespace-nowrap", className)} style={style}>
        {data.map((value, index) => (
            <s
                key={`spectrogram-${index}`}
                className={cn(
                    "inline-block max-lg:w-[3.5px] max-sm:w-0.5 lg:w-[2.5px]",
                    "pt-1 -mt-1 mr-0.5 rounded-sm align-bottom box-border",
                    barClassName
                )}
                style={{ height: `${value * 3}%` }}
            />
        ))}
    </div>
));

SpectrogramBars.displayName = "SpectrogramBars";

type AudioSpectrogramProps = {
    data: number[];
    playedFraction: number;
    onInteractionStart: (event: React.MouseEvent | React.TouchEvent) => void;
    onInteractionMove: (event: React.MouseEvent | React.TouchEvent) => void;
    spectrogramRef: React.RefObject<HTMLDivElement | null>;
};

const AudioSpectrogram = memo<AudioSpectrogramProps>(
    ({ data, playedFraction, onInteractionStart, onInteractionMove, spectrogramRef }) => {
        const [isMouseDown, setIsMouseDown] = useState(false);

        const handleMouseDown = useCallback(
            (e: React.MouseEvent) => {
                setIsMouseDown(true);
                onInteractionStart(e);
            },
            [onInteractionStart]
        );

        const handleTouchStart = useCallback(
            (e: React.TouchEvent) => onInteractionStart(e),
            [onInteractionStart]
        );

        const handleMouseMove = useCallback(
            (e: React.MouseEvent) => {
                if (isMouseDown) {
                    onInteractionMove(e);
                }
            },
            [isMouseDown, onInteractionMove]
        );

        const handleTouchMove = useCallback(
            (e: React.TouchEvent) => onInteractionMove(e),
            [onInteractionMove]
        );

        const handleMouseUp = useCallback(() => {
            setIsMouseDown(false);
        }, []);

        useEffect(() => {
            const element = spectrogramRef.current;
            if (element) {
                element.addEventListener('mouseup', handleMouseUp);
                return () => {
                    element.removeEventListener('mouseup', handleMouseUp);
                };
            }
        }, [handleMouseUp, spectrogramRef]);

        return (
            <div
                ref={spectrogramRef}
                className="relative pt-0 mt-0 h-4 overflow-hidden select-none max-sm:hidden cursor-pointer w-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                <SpectrogramBars
                    data={data}
                    barClassName="bg-neutral-300 dark:bg-neutral-600"
                />
                <div
                    className="relative h-[18px] -mt-1 pt-1 overflow-hidden w-0"
                    style={{ width: `${playedFraction * 100}%` }}
                >
                    <SpectrogramBars
                        data={data}
                        barClassName="bg-[--vkui--color_background_accent]"
                    />
                </div>
            </div>
        );
    }
);

AudioSpectrogram.displayName = "AudioSpectrogram";

type PlayPauseButtonProps = {
    playing: boolean;
    onClick: () => void;
};

const PlayPauseButton = memo<PlayPauseButtonProps>(({ playing, onClick }) => (
    <button
        className="inline-block float-left size-12 rounded-full bg-[--vkui--color_background_accent]"
        onClick={onClick}
    >
        <div className="flex justify-center m-auto text-[--vkui--color_text_contrast]">
            {!playing ? <Icon28Play /> : <Icon28Pause />}
        </div>
    </button>
));

PlayPauseButton.displayName = "PlayPauseButton";

type TimeDisplayProps = {
    time: string;
    className?: string;
};

const TimeDisplay = memo<TimeDisplayProps>(({ time, className }) => (
    <time className={cn(
        "inline-block text-sm leading-[19px] mt-[5px] mb-0.5 text-neutral-600",
        className
    )}>
        {time}
    </time>
));

TimeDisplay.displayName = "TimeDisplay";

type AudioControlsContainerProps = {
    children: React.ReactNode;
};

const AudioControlsContainer = memo<AudioControlsContainerProps>(({ children }) => (
    <div className={cn(
        "ml-[60px] pt-1",
        "max-md:w-full max-md:max-w-[550px]",
        "md:max-lg:w-[calc(100%-80px)]",
        "lg:w-[calc(100%-64px)]"
    )}>
        {children}
    </div>
));

AudioControlsContainer.displayName = "AudioControlsContainer";

type MobileSliderProps = {
    value: number;
    onChange: (value: number) => void;
};

const MobileSlider = memo<MobileSliderProps>(({ value, onChange }) => (
    <div className="sm:hidden w-full pr-16">
        <Slider value={value} aria-labelledby="basic" onChange={onChange} />
    </div>
));

MobileSlider.displayName = "MobileSlider";

export const AudioPost = memo(({ post }: { post: Post }) => {
    const [playing, setPlaying] = useState(false);
    const [playedFraction, setPlayedFraction] = useState(0);
    const [remainingTime, setRemainingTime] = useState<string>("0:00");

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

    const handleInteractionStart = useCallback((event: React.TouchEvent | React.MouseEvent) => {
        handleInteraction(event);
    }, [handleInteraction]);

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

    if (!post.content.media?.[0] || !["voice", "audio"].includes(post.content.media[0].type)) {
        return null;
    }

    const media = post.content.media[0];
    const spectrogramData = media.waves
        ? media.waves.split(",").map(Number)
        : Array.from({ length: 100 }, () => 1);

    return (
        <div className="block mt-3 mb-0 select-none">
            <PlayPauseButton playing={playing} onClick={handlePlayPause} />

            <AudioControlsContainer>
                <AudioSpectrogram
                    data={spectrogramData}
                    playedFraction={playedFraction}
                    onInteractionStart={handleInteractionStart}
                    onInteractionMove={handleInteraction}
                    spectrogramRef={spectrogramRef}
                />

                <MobileSlider
                    value={playedFraction * 100}
                    onChange={updateFraction}
                />

                <TimeDisplay
                    time={!playedFraction ? media.duration.formatted : remainingTime}
                />
            </AudioControlsContainer>

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
