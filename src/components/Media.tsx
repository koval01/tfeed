import React from 'react';
import '@/styles/mediaGrid.css';

import {
    getLayoutConfig,
    getItemClass,
    getSecondRowAspectRatio
} from '@/helpers/mediaGridUtils';

import { NextImage as Image } from '@/components/NextImage';

type Image = {
    url: string;
    alt?: string;
};

type VKMediaGridProps = {
    images: Image[];
};

export const VKMediaGrid: React.FC<VKMediaGridProps> = ({ images }) => {
    const imageCount = images.length;

    // Get layout configuration based on the number of images
    const { rows, perRow } = getLayoutConfig(imageCount);

    // Determine aspect ratio for images in the second row
    const secondRowRatio = getSecondRowAspectRatio(imageCount);

    return (
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
                    >
                        <Image
                            className="MediaGrid__imageElement"
                            widthSize={"100%"}
                            heightSize={"100%"}
                            src={image.url}
                            alt={image.alt || ''}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
