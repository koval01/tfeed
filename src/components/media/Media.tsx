"use client";

import React from 'react';

import type { AppDispatch } from '@/lib/store';
import type { Media } from '@/types/media';

import { useDispatch } from 'react-redux';
import { useMediaControl } from "@/hooks/services/useMediaControl";

import { blockScroll } from '@/store/scrollSlice';
import { openViewer, setVisible } from '@/store/viewerSlice';

import {
    getItemClass,
    getLayoutConfig,
    getSecondRowAspectRatio
} from '@/helpers/mediaGridUtils';

import { calculateEndDimensions } from '@/helpers/calcEndDimensions';

import { LazyImage as Image } from '@/components/media/LazyImage';
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
    const { stopAllMedia } = useMediaControl();

    const mediaCount = mediaCollection.length;
    if (!mediaCount) return;

    const { rows, perRow } = getLayoutConfig(mediaCount);
    const secondRowRatio = getSecondRowAspectRatio(mediaCount);

    const handleMediaClick = (mediaItem: Media, event: React.MouseEvent) => {
        const thumbnailContainer = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const { top, left, width, height } = thumbnailContainer;

        const tempImage = new window.Image();
        tempImage.src = mediaItem.url;

        stopAllMedia();

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
                className={`MediaGrid ${rows === 3 ? 'MediaGrid--threeRow' : 'MediaGrid--twoRow'}`}
                style={{
                    '--mg-second-row-count': perRow[1] || 0,
                    '--mg-third-row-count': rows === 3 ? perRow[2] || 0 : 0
                } as React.CSSProperties}
            >
                {mediaCollection.map((media, index) => {
                    const isLastItem = index === mediaCollection.length - 1;
                    const isFirstInLastRow = index === mediaCollection.length - perRow[perRow.length - 1];

                    let additionalClasses = '';
                    if (isLastItem) {
                        additionalClasses += ' MediaGrid__thumb--bottomRightCorner';
                    }
                    if (isFirstInLastRow) {
                        additionalClasses += ' MediaGrid__thumb--bottomLeftCorner';
                    }

                    return (
                        <div
                            key={`media__item_${media.url}`}
                            className={`${getItemClass(index, mediaCount, perRow)}${additionalClasses}`}
                            style={{ '--mg-ratio': index < 2 ? 1 : index < 2 + perRow[1] ? secondRowRatio : 1 } as React.CSSProperties}
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
                            {media.type === "video" &&(<div
                                className="absolute z-[2] bottom-0 -right-2"
                                style={{
                                    transform: "translate(-50%, -50%)"
                                }}
                            >
                                <div className="text-center text-white bg-black/30 rounded-lg backdrop-blur-md px-2 py-0 text-sm md:text-base">
                                    {media?.duration?.formatted}
                                </div>
                            </div>
                        )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
});

VKMediaGrid.displayName = 'VKMediaGrid';
