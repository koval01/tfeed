"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Media } from '@/types/media';

import {
    getLayoutConfig,
    getItemClass,
    getSecondRowAspectRatio
} from '@/helpers/mediaGridUtils';

import { NextImage as Image } from '@/components/NextImage';
import { Icons } from '@/components/icons';

import { cn } from '@/lib/utils';
import _ from 'lodash';

import '@/styles/mediaGrid.css';
import { Icon28Play } from '@vkontakte/icons';

type VKMediaGridProps = {
    mediaCollection: Media[];
};

// Reusable FallbackIcon Component
const FallbackIcon: React.FC = () => (
    <Icons.logo className="mx-auto min-w-6 min-h-6 md:min-w-10 md:min-h-10 size-5/12 text-[--vkui--color_text_secondary]" />
);

// Overlay Component
const ImageOverlay: React.FC<{
    mediaItem: Media;
    transitionStyle: Record<string, string>;
    isAnimating: boolean;
    isClosing: boolean;
    isOverlayVisible: boolean;
    onClose: () => void;
}> = ({ mediaItem, transitionStyle, isAnimating, isClosing, isOverlayVisible, onClose }) => (
    <div
        className={cn(
            "fixed inset-0 z-50 flex items-center justify-center MediaGrid__overlayContainer",
            isAnimating && !isClosing ? 'animating' : ''
        )}
        style={transitionStyle}
        onClick={onClose}
    >
        {/* Smooth Background Blur and Dimming */}
        <div
            className={cn(
                "MediaGrid__backgroundBlur",
                isOverlayVisible ? 'visible' : '_invisible'
            )}
        ></div>

        {/* Media Transition */}
        <Image
            widthSize={""}
            heightSize={""}
            src={mediaItem.url}
            alt={mediaItem.type || ''}
            fallbackIcon={<FallbackIcon />}
            className="absolute MediaGrid__imageTransition"
        />
        {mediaItem.type === "video" && (
            <video
                preload="auto"
                controls
                autoPlay
                width="auto"
                height="auto"
                playsInline
                crossOrigin="anonymous"
                poster={mediaItem.url}
                className="absolute MediaGrid__imageTransition"
                onError={(error) => { console.error(error) }}
            >
                <source src={mediaItem.video_url} type="video/mp4" />
            </video>
        )}
    </div>
);

export const VKMediaGrid: React.FC<VKMediaGridProps> = ({ mediaCollection }) => {
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [transitionStyle, setTransitionStyle] = useState<Record<string, string>>({});
    const [isAnimating, setIsAnimating] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const mediaCount = mediaCollection.length;
    const { perRow } = getLayoutConfig(mediaCount);
    const secondRowRatio = getSecondRowAspectRatio(mediaCount);

    // Handle media click
    const handleMediaClick = (mediaItem: Media, event: React.MouseEvent) => {
        const thumbnailContainer = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const { top, left, width, height } = thumbnailContainer;

        // Preload media to get dimensions
        const tempImage = new window.Image();
        tempImage.src = mediaItem.url;

        tempImage.onload = () => {
            const { naturalWidth, naturalHeight } = tempImage;
            const imageAspectRatio = naturalWidth / naturalHeight;

            // Calculate dimensions
            const { endWidth, endHeight } = calculateEndDimensions(imageAspectRatio);

            setTransitionStyle({
                '--start-top': `${top}px`,
                '--start-left': `${left}px`,
                '--start-width': `${width}px`,
                '--start-height': `${height}px`,
                '--end-width': `${endWidth}px`,
                '--end-height': `${endHeight}px`,
                '--aspect-ratio': `${imageAspectRatio}`,
            });

            setSelectedMedia(mediaItem);
            setIsAnimating(true);

            setTimeout(() => setIsOverlayVisible(true), 10);
        };
    };

    // Close overlay
    const closeOverlay = useCallback(() => {
        setIsClosing(true);
        setIsOverlayVisible(false);

        setTimeout(() => {
            setIsAnimating(false);
            setIsClosing(false);
            setSelectedMedia(null);
        }, 500);
    }, []);

    // Calculate final media dimensions
    const calculateEndDimensions = useCallback((aspectRatio: number) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxWidth = viewportWidth * 0.9; // 90% of viewport width
        const maxHeight = viewportHeight * 0.9; // 90% of viewport height

        let endWidth = maxWidth;
        let endHeight = maxWidth / aspectRatio;

        if (endHeight > maxHeight) {
            endHeight = maxHeight;
            endWidth = maxHeight * aspectRatio;
        }

        return { endWidth, endHeight };
    }, []);

    // Handle resizing
    useEffect(() => {
        const recalculateDimensions = () => {
            if (!selectedMedia) return;

            const tempImage = new window.Image();
            tempImage.src = selectedMedia.url;

            const updateDimensions = () => {
                const { naturalWidth, naturalHeight } = tempImage;
                const { endWidth, endHeight } = calculateEndDimensions(
                    naturalWidth / naturalHeight
                );

                setTransitionStyle((prev) => ({
                    ...prev,
                    '--end-width': `${endWidth}px`,
                    '--end-height': `${endHeight}px`,
                }));
            };

            // If the image is already loaded, recalculate immediately
            if (tempImage.complete) {
                updateDimensions(); // Call the recalculation directly
            } else {
                tempImage.onload = updateDimensions; // Attach the recalculation to onload
            }
        };

        // Recalculate on resize
        const handleResize = _.debounce(recalculateDimensions, 150);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [selectedMedia, calculateEndDimensions]);

    // Close overlay with Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.key === "Enter") closeOverlay();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeOverlay]);

    return (
        <>
            <div className="select-none MediaGridContainerWeb--post">
                <div
                    className="MediaGrid MediaGrid--twoRow"
                    style={{ '--mg-second-row-count': perRow[1] || 0 } as React.CSSProperties}
                >
                    {mediaCollection.map((media, index) => (
                        <div
                            key={media.url}
                            className={getItemClass(index, mediaCount, perRow)}
                            style={{ '--mg-ratio': index < 2 ? 1 : secondRowRatio } as React.CSSProperties}
                            onClick={(e) => handleMediaClick(media, e)}
                        >
                            <Image
                                className="MediaGrid__imageElement cursor-pointer"
                                widthSize={'100%'}
                                heightSize={'100%'}
                                src={media.url}
                                alt={media.type || ''}
                                fallbackIcon={<FallbackIcon />}
                            >
                                {media.type === "video" && (
                                    <div
                                        className="flex items-center justify-center rounded-full bg-black/50 backdrop-blur-lg w-auto aspect-square"
                                        style={{
                                            height: "clamp(40px, 15%, 120px)"
                                        }}
                                    >
                                        <Icon28Play className="object-contain size-[70%] text-[--vkui--color_text_contrast]" />
                                    </div>

                                )}
                            </Image>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMedia && (
                <ImageOverlay
                    mediaItem={selectedMedia}
                    transitionStyle={transitionStyle}
                    isAnimating={isAnimating}
                    isClosing={isClosing}
                    isOverlayVisible={isOverlayVisible}
                    onClose={closeOverlay}
                />
            )}
        </>
    );
};
