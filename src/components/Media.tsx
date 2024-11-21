import React from 'react';
import '@/styles/mediaGrid.css';

import { 
    getLayoutConfig, 
    getItemClass, 
    getSecondRowAspectRatio 
} from '@/helpers/mediaGridUtils';

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
        <div className="MediaGridContainerWeb--post">
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
                        <img
                            className="MediaGrid__imageElement"
                            src={image.url}
                            loading="lazy"
                            alt={image.alt || ''}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = "/images/errorImageLoad.webp";
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
