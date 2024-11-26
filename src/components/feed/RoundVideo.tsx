import { useState, useRef, useEffect } from "react";
import type { Post } from "@/types";

import { Icon28Play, Icon28Pause } from "@vkontakte/icons";
import { cn } from "@/lib/utils";

export const RoundVideo = ({ post }: { post: Post }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play();
                setIsPlaying(true);
                if (window.innerWidth <= 768) {
                    setIsButtonVisible(false);
                }
            } else {
                video.pause();
                setIsPlaying(false);
                setIsButtonVisible(true);
            }
        }
    };

    useEffect(() => {
        if (isPlaying && window.innerWidth <= 768) {
            const timeout = setTimeout(() => setIsButtonVisible(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [isPlaying]);

    return (
        post.content.media &&
        post.content.media[0].type === "roundvideo" && (
            <div
                className={cn(
                    "relative size-full max-lg:max-w-96 rounded-full overflow-hidden",
                    "shadow-lg border-2 border-[--vkui--color_image_border_alpha]"
                )}
                onMouseEnter={() => window.innerWidth > 768 && setIsButtonVisible(true)}
                onMouseLeave={() => isPlaying && setIsButtonVisible(false)}
                onTouchStart={() => window.innerWidth <= 768 && setIsButtonVisible(true)}
                onTouchEnd={() => window.innerWidth <= 768 && setIsButtonVisible(false)}
            >
                <video
                    ref={videoRef}
                    src={post.content.media[0].url}
                    poster={post.content.media[0].thumb}
                    className="w-full h-full object-cover"
                    controls={false}
                    loop
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
                <button
                    className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",
                        "rounded-full bg-black/50 backdrop-blur-md hover:bg-black/60 transition-opacity duration-300",
                        isButtonVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    style={{
                        width: "clamp(40px, 15%, 120px)",
                        height: "clamp(40px, 15%, 120px)",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                    }}
                >
                    {isPlaying ? (
                        <Icon28Pause className="w-1/2 h-1/2 text-[--vkui--color_text_contrast]" />
                    ) : (
                        <Icon28Play className="w-1/2 h-1/2 text-[--vkui--color_text_contrast]" />
                    )}
                </button>
            </div>
        )
    );
};
