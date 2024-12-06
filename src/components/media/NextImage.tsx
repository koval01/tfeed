import React from 'react';

import { Image, type ImageProps as VKImageProps } from "@vkontakte/vkui";
import { nextImage } from '@/helpers/nextImage';

interface ImageProps extends VKImageProps {
    proxy?: boolean;
}

interface WrappedImageProps extends React.ComponentProps<typeof Image> {
    children?: React.ReactNode;
}

const WrappedImage: React.FC<WrappedImageProps> = ({ children, ...props }) => {
    return (
        <Image {...props}>
            {children}
        </Image>
    );
};

const MemoizedImage = React.memo(WrappedImage);

/*
* Custom realization Image component in next
*/
export const NextImage: React.FC<ImageProps> = ({ children, src, proxy = false, ...props }) => {
    const modifiedSrc = src ? nextImage(src, 512) : undefined;
    return (
        <MemoizedImage
            key={`image__item_${src}`}
            src={proxy ? modifiedSrc : src} 
            alt={props.alt}
            loading="lazy"
            {...props}
        >
            {children}
        </MemoizedImage>
    );
};
