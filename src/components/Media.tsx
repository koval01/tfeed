import React, { useState, useRef, useEffect, useCallback } from 'react';
import '@/styles/mediaGrid.css';
import { getLayoutConfig, getItemClass, getSecondRowAspectRatio } from '@/helpers/mediaGridUtils';
import { NextImage as Image } from '@/components/NextImage';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import _ from 'lodash';

// Types
type Image = {
    url: string;
    alt?: string;
};

type VKMediaGridProps = {
    images: Image[];
};

// Reusable FallbackIcon Component
const FallbackIcon: React.FC = () => (
    <Icons.logo className="mx-auto min-w-6 min-h-6 md:min-w-10 md:min-h-10 size-5/12 text-[--vkui--color_text_secondary]" />
);

// Overlay Component
const ImageOverlay: React.FC<{
    image: Image;
    transitionStyle: Record<string, string>;
    isAnimating: boolean;
    isClosing: boolean;
    isOverlayVisible: boolean;
    onClose: () => void;
}> = ({ image, transitionStyle, isAnimating, isClosing, isOverlayVisible, onClose }) => (
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
            src={image.url}
            alt={image.alt || ''}
            fallbackIcon={<FallbackIcon />}
            className="absolute MediaGrid__imageTransition"
        />
    </div>
);

export const VKMediaGrid: React.FC<VKMediaGridProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [transitionStyle, setTransitionStyle] = useState<Record<string, string>>({});
    const [isAnimating, setIsAnimating] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const imageCount = images.length;
    const { rows, perRow } = getLayoutConfig(imageCount);
    const secondRowRatio = getSecondRowAspectRatio(imageCount);

    // Handle image click
    const handleImageClick = (image: Image, event: React.MouseEvent) => {
        const thumbnailContainer = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const { top, left, width, height } = thumbnailContainer;

        // Preload image to get dimensions
        const tempImage = new window.Image();
        tempImage.src = image.url;

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

            setSelectedImage(image);
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
            setSelectedImage(null);
        }, 500);
    }, []);

    // Calculate final image dimensions
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
            if (!selectedImage) return;

            const tempImage = new window.Image();
            tempImage.src = selectedImage.url;

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
    }, [selectedImage, calculateEndDimensions]);

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
                    {images.map((image, index) => (
                        <div
                            key={image.url}
                            className={getItemClass(index, imageCount, perRow)}
                            style={{ '--mg-ratio': index < 2 ? 1 : secondRowRatio } as React.CSSProperties}
                            onClick={(e) => handleImageClick(image, e)}
                        >
                            <Image
                                className="MediaGrid__imageElement cursor-pointer"
                                widthSize={'100%'}
                                heightSize={'100%'}
                                src={image.url}
                                alt={image.alt || ''}
                                fallbackIcon={<FallbackIcon />}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <ImageOverlay
                    image={selectedImage}
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
