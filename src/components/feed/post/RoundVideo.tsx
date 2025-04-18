import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Post } from "@/types";

import { useMediaPlayback } from '@/hooks/services/useMediaPlayback';

import { LazyImage as Image } from "@/components/media/LazyImage";
import { Icon28Play, Icon28Pause } from "@vkontakte/icons";
import { Spinner } from "@vkontakte/vkui";

import { cn } from "@/lib/utils/clsx";
import { t } from "i18next";

/**
 * Types for video control props
 */
interface VideoControlProps {
    isPlaying: boolean;
    isVisible: boolean;
    isBuffering: boolean;
    onToggle: (e: React.MouseEvent) => void;
}

/**
 * Video control button component that shows play/pause
 */
const VideoControl = ({ isPlaying, isVisible, isBuffering, onToggle }: VideoControlProps) => (
    <button
        className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "flex items-center justify-center rounded-full aspect-square",
            "bg-black/50 backdrop-blur-md hover:bg-black/60 transition-opacity duration-300",
            // Show if either isBuffering is true OR isVisible is true
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
);

const VideoPreview = ({ thumb, isLoaded }: { thumb?: string, isLoaded: boolean }) => (
    !isLoaded  && <Image
        src={thumb}
        alt={"Round video preview"}
        widthSize={"100%"}
        heightSize={"100%"}
        noBorder
        keepAspectRatio
        className="absolute z-5 top-0 w-full h-full object-cover aspect-square rounded-none"
    />
);

const VideoTime = ({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) => {
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

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleLoadedMetadata);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleLoadedMetadata);
        };
    }, [videoRef, updateTime, handleLoadedMetadata]);

    return (
        <div
            className="absolute z-10 bottom-0 left-1/2"
            style={{
                transform: "translate(-50%, -50%)"
            }}
        >
            <div className="text-center text-white bg-black/30 rounded-lg backdrop-blur-md px-2 py-0">
                {timeDisplay}
            </div>
        </div>
    );
};

/**
 * Main round video component that displays circular video with play/pause controls
 */
export const RoundVideo = React.memo(({ post }: { post: Post }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isBuffering, setIsBuffering] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useMediaPlayback(videoRef);

    const isMobile = window.innerWidth <= 768;
    const videoMedia = post.content.media?.[0];
    const isRoundVideo = videoMedia && videoMedia.type === "roundvideo";

    // Intersection Observer setup
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isIntersecting = entry.isIntersecting;
                    setIsVisible(isIntersecting);

                    if (!isIntersecting) {
                        setIsLoaded(false);

                        if (videoRef.current) {
                            videoRef.current.pause();
                            setIsPlaying(false);
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [videoRef]);

    // Handle loading state based on both video loaded and visibility
    useEffect(() => {
        if (isVideoLoaded && isVisible) {
            // wait after isVisible changed
            const timer = setTimeout(() => setIsLoaded(true), 5e2);
            return () => clearTimeout(timer);
        }
    }, [isVideoLoaded, isVisible]);

    useEffect(() => {
        if (isPlaying && (isMobile || !isBuffering)) {
            const timeout = setTimeout(() => {
                // Only hide the button if we're not buffering
                if (!isBuffering) {
                    setIsButtonVisible(false);
                }
            }, 1e3);
            return () => clearTimeout(timeout);
        }
    }, [isPlaying, isMobile, isBuffering]);

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
            isMobile && setIsButtonVisible(false);
        } else {
            video.pause();
            setIsPlaying(false);
            setIsButtonVisible(true);
        }
    }, [isMobile]);

    if (!isRoundVideo) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative size-full max-lg:max-w-96 rounded-full overflow-hidden",
                "shadow-lg border-2 border-[--vkui--color_image_border_alpha] aspect-square"
            )}
            onMouseEnter={() => !isMobile && setIsButtonVisible(true)}
            onMouseLeave={() => isPlaying && !isBuffering && setIsButtonVisible(false)}
            onTouchStart={() => isMobile && setIsButtonVisible(true)}
            onTouchEnd={() => isMobile && !isBuffering && setIsButtonVisible(false)}
        >
            <video
                ref={videoRef}
                src={videoMedia.url}
                poster={videoMedia?.thumb}
                className={cn("w-full h-full object-cover aspect-square", !isLoaded && "invisible")}
                controls={false}
                loop={false}
                onLoadedData={() => setIsVideoLoaded(true)}
                onClick={togglePlay}
                onPlay={() => {
                    setIsPlaying(true);
                    isMobile && setIsButtonVisible(false);
                }}
                onPause={() => {
                    setIsPlaying(false);
                    isMobile && setIsButtonVisible(true);
                }}
                onEnded={() => setIsButtonVisible(true)}
                onWaiting={() => setIsBuffering(true)}
                onCanPlay={() => setIsBuffering(false)}
            />

            <VideoTime videoRef={videoRef} />
            <VideoPreview thumb={videoMedia?.thumb} isLoaded={isLoaded} />

            <VideoControl
                isPlaying={isPlaying}
                isVisible={isButtonVisible}
                isBuffering={isBuffering}
                onToggle={(e) => {
                    e.stopPropagation();
                    togglePlay();
                }}
            />
        </div>
    );
});

RoundVideo.displayName = "RoundVideo";
