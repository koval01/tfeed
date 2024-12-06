"use client";

import React from 'react';

import type { AppDispatch } from '@/lib/store';
import type { Media } from '@/types/media';

import { useDispatch } from 'react-redux';

import { blockScroll } from '@/store/scrollSlice';
import { openViewer, setVisible } from '@/store/viewerSlice';

import {
    getItemClass,
    getLayoutConfig,
    getSecondRowAspectRatio
} from '@/helpers/mediaGridUtils';

import { calculateEndDimensions } from '@/helpers/calcEndDimensions';

import { NextImage as Image } from '@/components/media/NextImage';
import { Icons } from '@/components/ui/Icons';
import { Icon28Play } from '@vkontakte/icons';

import '@/styles/components/mediaGrid.css';

type VKMediaGridProps = {
    mediaCollection: Media[];
};

const FallbackIcon: React.FC = () => (
    <Icons.logo className="mx-auto min-w-6 min-h-6 md:min-w-10 md:min-h-10 size-5/12 text-[--vkui--color_text_secondary]" />
);

export const VKMediaGrid = React.memo<VKMediaGridProps>(({ mediaCollection }) => {
    const dispatch = useDispatch<AppDispatch>();

    const mediaCount = mediaCollection.length;
    const { perRow } = getLayoutConfig(mediaCount);
    const secondRowRatio = getSecondRowAspectRatio(mediaCount);

    const handleMediaClick = (mediaItem: Media, event: React.MouseEvent) => {
        const thumbnailContainer = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const { top, left, width, height } = thumbnailContainer;

        const tempImage = new window.Image();
        tempImage.src = mediaItem.url;

        tempImage.onload = () => {
            const { naturalWidth, naturalHeight } = tempImage;
            const imageAspectRatio = naturalWidth / naturalHeight;

            const { endWidth, endHeight } = calculateEndDimensions(imageAspectRatio);

            dispatch(blockScroll());
            dispatch(
                openViewer({
                    media: mediaItem,
                    style: {
                        '--start-top': `${top}px`,
                        '--start-left': `${left}px`,
                        '--start-width': `${width}px`,
                        '--start-height': `${height}px`,
                        '--end-width': `${endWidth}px`,
                        '--end-height': `${endHeight}px`,
                        '--aspect-ratio': `${imageAspectRatio}`,
                    },
                })
            );

            setTimeout(() => dispatch(setVisible(true)), 10);
        };
    };

    return (
        <div className="select-none MediaGridContainerWeb--post">
            <div
                className="MediaGrid MediaGrid--twoRow"
                style={{ '--mg-second-row-count': perRow[1] || 0 } as React.CSSProperties}
            >
                {mediaCollection.map((media, index) => (
                    <div
                        key={`media__item_${media.url}`}
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
    );
});

VKMediaGrid.displayName = 'VKMediaGrid';
