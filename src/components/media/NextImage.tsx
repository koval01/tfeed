import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';

import { Image, type ImageProps as VKImageProps } from "@vkontakte/vkui";
import { Icon36PictureOutline } from '@vkontakte/icons';

import { nextImage } from '@/helpers/nextImage';
import { throttle } from 'lodash';

interface ImageProps extends VKImageProps {
    children?: React.ReactNode;
    src: string;
    proxy?: boolean;
    alt?: string;
    priority?: boolean;
}

const WrappedImageComponent: React.FC<ImageProps> = ({
    src,
    proxy = false,
    alt = "",
    priority = false,
    children,
    ...props
}) => {
    const [imageKey, setImageKey] = useState(`image_${Date.now()}`);
    const [hasError, setHasError] = useState(false);
    const modifiedSrc = useMemo(() =>
        src ? (proxy ? nextImage(src, 512) : src) : undefined,
        [src, proxy]
    );

    const handleError = useCallback(() => {
        if (!hasError) {
            setHasError(true);
            setImageKey(`image_retry_${Date.now()}`);
        }
    }, [hasError]);

    const throttledHandleError = useMemo(
        () => throttle(handleError, 1000, { leading: true, trailing: false }),
        [handleError]
    );

    useEffect(() => {
        return () => throttledHandleError.cancel();
    }, [throttledHandleError]);

    // Reset error state when src changes
    useEffect(() => {
        setHasError(false);
    }, [src]);

    return (
        <Image
            {...props}
            key={imageKey}
            src={modifiedSrc}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
            fallbackIcon={<Icon36PictureOutline width={24} height={24} />}
            onError={throttledHandleError}
        >
            {children}
        </Image>
    );
};

export const NextImage = memo(WrappedImageComponent, (prev, next) => {
    return (
        prev.src === next.src &&
        prev.proxy === next.proxy &&
        prev.alt === next.alt &&
        prev.priority === next.priority
    );
});
