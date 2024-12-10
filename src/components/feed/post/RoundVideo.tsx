import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Post } from "@/types";

import { useMediaPlayback } from '@/hooks/services/useMediaPlayback';

import { LazyImage as Image } from "@/components/media/LazyImage";
import { Icon28Play, Icon28Pause } from "@vkontakte/icons";
import { Spinner } from "@vkontakte/vkui";

import { cn } from "@/lib/utils";
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
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
            width: "clamp(40px, 15%, 60px)",
            height: "clamp(40px, 15%, 60px)"
        }}
        onClick={onToggle}
        aria-label={t("Play media button")}
    >
        {isPlaying ? isBuffering ? (
            <Spinner size="l" />
        ) : (
            <Icon28Pause className="w-1/2 h-1/2 text-[--vkui--color_text_contrast]" />
        ) : (
            <Icon28Play className="w-1/2 h-1/2 text-[--vkui--color_text_contrast]" />
        )}
    </button>
);

const VideoPreview = ({ thumb, isLoaded }: { thumb?: string, isLoaded: boolean }) => (
    !isLoaded && <Image
        src={thumb}
        alt={"Round video preview"}
        widthSize={"100%"}
        heightSize={"100%"}
        noBorder
        keepAspectRatio
        withTransparentBackground
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
            className="absolute z-5 bottom-0 left-1/2"
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
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useMediaPlayback(videoRef);

    // Determine whether the device is mobile
    const isMobile = window.innerWidth <= 768;

    // Extract the video media from the post
    const videoMedia = post.content.media?.[0];
    const isRoundVideo = videoMedia && videoMedia.type === "roundvideo";

    /**
     * Effect to hide the play/pause button after 1 second on mobile when the video is playing
     */
    useEffect(() => {
        if (isPlaying && (isMobile || !isBuffering)) {
            const timeout = setTimeout(() => setIsButtonVisible(false), 1e3);
            return () => clearTimeout(timeout);
        }
    }, [isPlaying, isMobile, isBuffering]);

    /**
     * Handles video playback toggling
     */
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
    }, [videoRef, isMobile]);

    // If the post doesn't have a valid round video, render `null`
    if (!isRoundVideo) {
        return null;
    }

    return (
        <div
            className={cn(
                "relative size-full max-lg:max-w-96 rounded-full overflow-hidden",
                "shadow-lg border-2 border-[--vkui--color_image_border_alpha] aspect-square"
            )}
            onMouseEnter={() => !isMobile && setIsButtonVisible(true)}
            onMouseLeave={() => isPlaying && setIsButtonVisible(false)}
            onTouchStart={() => isMobile && setIsButtonVisible(true)}
            onTouchEnd={() => isMobile && setIsButtonVisible(false)}
        >
            <video
                ref={videoRef}
                src={videoMedia.url}
                className="w-full h-full object-cover aspect-square"
                controls={false}
                loop={false}
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
                onCanPlayThrough={() => setIsLoaded(true)}
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
