import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Post } from "@/types";

import { useMediaPlayback } from '@/hooks/services/useMediaPlayback';
import { useIntersectionObserver } from '@/hooks/utils/useIntersectionObserver';
import { useDeviceType } from '@/hooks/utils/useDeviceType';

import { LazyImage as Image } from "@/components/media/LazyImage";
import { Icon28Play, Icon28Pause } from "@vkontakte/icons";
import { Spinner } from "@vkontakte/vkui";

import { cn } from "@/lib/utils/clsx";
import { t } from "i18next";

interface VideoControlProps {
    isPlaying: boolean;
    isVisible: boolean;
    isBuffering: boolean;
    onToggle: (e: React.MouseEvent) => void;
}

const VideoControl = React.memo(({ isPlaying, isVisible, isBuffering, onToggle }: VideoControlProps) => (
    <button
        className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "flex items-center justify-center rounded-full aspect-square",
            "bg-black/50 backdrop-blur-md hover:bg-black/60 transition-opacity duration-300",
            isBuffering || isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
            width: "clamp(40px, 15%, 60px)",
            height: "clamp(40px, 15%, 60px)"
        }}
        onClick={onToggle}
        aria-label={t("Play media button")}
    >
        <div className="text-[--vkui--color_text_contrast]">
            {isPlaying ? isBuffering ? (
                <Spinner size="l" className="text-inherit" />
            ) : (
                <Icon28Pause className="size-1/2" />
            ) : (
                <Icon28Play className="size-1/2" />
            )}
        </div>
    </button>
));

VideoControl.displayName = "VideoControl";

interface VideoPreviewProps {
    thumb?: string;
    isLoaded: boolean;
}

const VideoPreview = React.memo(({ thumb, isLoaded }: VideoPreviewProps) => (
    (!isLoaded && thumb) ? (
        <Image
            src={thumb}
            alt={"Round video preview"}
            widthSize={"100%"}
            heightSize={"100%"}
            noBorder
            keepAspectRatio
            className="absolute z-5 top-0 w-full h-full object-cover aspect-square rounded-none"
        />
    ) : null
));

VideoPreview.displayName = "VideoPreview";

interface VideoTimeProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

const VideoTime = React.memo(({ videoRef }: VideoTimeProps) => {
    const [timeDisplay, setTimeDisplay] = useState("0:00");

    const formatTime = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    const updateTime = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        const timeLeft = video.duration - video.currentTime;
        setTimeDisplay(formatTime(timeLeft));
    }, [videoRef, formatTime]);

    const handleLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        setTimeDisplay(formatTime(video.duration));
    }, [videoRef, formatTime]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const events = [
            { name: 'timeupdate', handler: updateTime },
            { name: 'loadedmetadata', handler: handleLoadedMetadata },
            { name: 'ended', handler: handleLoadedMetadata }
        ];

        events.forEach(({ name, handler }) => {
            video.addEventListener(name, handler);
        });

        return () => {
            events.forEach(({ name, handler }) => {
                video.removeEventListener(name, handler);
            });
        };
    }, [videoRef, updateTime, handleLoadedMetadata]);

    return (
        <div
            className="absolute z-10 bottom-0 left-1/2"
            style={{
                transform: "translate(-50%, -50%)"
            }}
        >
            <div className="text-center text-white bg-black/30 rounded-lg backdrop-blur-md px-2 py-0 text-sm md:text-base">
                {timeDisplay}
            </div>
        </div>
    );
});

VideoTime.displayName = "VideoTime";

interface RoundVideoProps {
    post: Post;
}

export const RoundVideo = React.memo(({ post }: RoundVideoProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hideButtonTimeoutRef = useRef<NodeJS.Timeout>(null);

    const { isMobile } = useDeviceType();
    const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 });

    const videoMedia = post.content.media?.[0];
    const isRoundVideo = videoMedia?.type === "roundvideo";

    useMediaPlayback(videoRef);

    const togglePlay = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(error => {
                console.error("Error playing video:", error);
                setIsPlaying(false);
            });
            setIsPlaying(true);
            if (isMobile) {
                setIsButtonVisible(false);
            }
        } else {
            video.pause();
            setIsPlaying(false);
            setIsButtonVisible(true);
        }
    }, [isMobile]);

    // Handle visibility changes
    useEffect(() => {
        if (!isVisible) {
            setIsLoaded(false);
            if (videoRef.current) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [isVisible]);

    // Handle loading state
    useEffect(() => {
        if (isVideoLoaded && isVisible) {
            const timer = setTimeout(() => setIsLoaded(true), 500);
            return () => clearTimeout(timer);
        }
    }, [isVideoLoaded, isVisible]);

    // Handle button visibility timeout
    useEffect(() => {
        if (isPlaying && (isMobile || !isBuffering)) {
            hideButtonTimeoutRef.current = setTimeout(() => {
                if (!isBuffering) {
                    setIsButtonVisible(false);
                }
            }, 1000);
        }

        return () => {
            if (hideButtonTimeoutRef.current) {
                clearTimeout(hideButtonTimeoutRef.current);
            }
        };
    }, [isPlaying, isMobile, isBuffering]);

    const handleMouseEnter = useCallback(() => {
        if (!isMobile) {
            setIsButtonVisible(true);
        }
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        if (isPlaying && !isBuffering) {
            setIsButtonVisible(false);
        }
    }, [isPlaying, isBuffering]);

    const handleTouchStart = useCallback(() => {
        if (isMobile) {
            setIsButtonVisible(true);
        }
    }, [isMobile]);

    const handleTouchEnd = useCallback(() => {
        if (isMobile && !isBuffering) {
            setIsButtonVisible(false);
        }
    }, [isMobile, isBuffering]);

    const videoEventHandlers = useMemo(() => ({
        onPlay: () => {
            setIsPlaying(true);
            if (isMobile) {
                setIsButtonVisible(false);
            }
        },
        onPause: () => {
            setIsPlaying(false);
            if (isMobile) {
                setIsButtonVisible(true);
            }
        },
        onEnded: () => setIsButtonVisible(true),
        onWaiting: () => setIsBuffering(true),
        onCanPlay: () => setIsBuffering(false),
        onLoadedData: () => setIsVideoLoaded(true),
        onClick: togglePlay
    }), [isMobile, togglePlay]);

    if (!isRoundVideo) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative size-full max-lg:max-w-96 rounded-full select-none overflow-hidden",
                "shadow-lg border-2 border-[--vkui--color_image_border_alpha] aspect-square"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <video
                ref={videoRef}
                src={videoMedia.url}
                poster={videoMedia?.thumb}
                className={cn("w-full h-full object-cover aspect-square", !isLoaded && "invisible")}
                controls={false}
                loop={false}
                {...videoEventHandlers}
            />

            <VideoTime videoRef={videoRef} />
            <VideoPreview thumb={videoMedia?.thumb} isLoaded={isLoaded} />

            <VideoControl
                isPlaying={isPlaying}
                isVisible={isButtonVisible}
                isBuffering={isBuffering}
                onToggle={togglePlay}
            />
        </div>
    );
});

RoundVideo.displayName = "RoundVideo";
