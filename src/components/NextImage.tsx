import React from 'react';

import { Image, type ImageProps as VKImageProps } from "@vkontakte/vkui";
import { nextImage } from '@/helpers/nextImage';

interface ImageProps extends VKImageProps {
    proxy?: boolean;
}

/*
* Custom realization Image component in next
*/
export const NextImage: React.FC<ImageProps> = ({ children, src, proxy = false, ...props }) => {
    const modifiedSrc = src ? nextImage(src, 512) : undefined;
    return (
        <Image 
            src={proxy ? modifiedSrc : src} 
            alt={props.alt}
            {...props}
        >
            {children}
        </Image>
    );
};
