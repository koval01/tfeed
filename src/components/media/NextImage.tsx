import React, { useCallback, useState } from 'react';

import { Image, type ImageProps as VKImageProps } from "@vkontakte/vkui";
import { Icon36PictureOutline } from '@vkontakte/icons';
import { nextImage } from '@/helpers/nextImage';
import { randomString } from '@/lib/utils';

import { throttle } from 'lodash';

interface ImageProps extends VKImageProps {
    children?: React.ReactNode;
    src: string;
    proxy?: boolean;
    alt?: string;
}

interface WrappedImageProps extends React.ComponentProps<typeof Image> {
    children?: React.ReactNode;
    src?: string;
    alt?: string;
    loading: "eager" | "lazy";
}

const WrappedImage: React.FC<WrappedImageProps> = ({ children, src, ...props }) => {
    const [imageKey, setImageKey] = useState(`image_${randomString()}`);

    const handleError = useCallback(
        throttle(() => {
            setImageKey(`image_${randomString()}`);
        }, 1e3),
        []
    );

    return (
        <Image key={imageKey} {...props} src={src} alt={props?.alt} fallbackIcon={<Icon36PictureOutline />} onError={handleError}>
            {children}
        </Image>
    );
};

const MemoizedImage = React.memo(WrappedImage);

/*
* Custom realization Image component in next
*/
export const NextImage: React.FC<ImageProps> = ({ children, src, proxy = false, alt, ...props }) => {
    const modifiedSrc = src ? nextImage(src, 512) : undefined;

    return (
        <MemoizedImage
            key={`image__item_${src}`}
            src={proxy ? modifiedSrc : src}
            alt={alt ?? ""}
            loading="lazy"
            {...props}
        >
            {children}
        </MemoizedImage>
    );
};
