import React from 'react';

import { Image, type ImageProps } from "@vkontakte/vkui";
import { nextImage } from '@/helpers/nextImage';

/*
* Custom realization Image component in next
*/
export const NextImage: React.FC<ImageProps> = ({ src, ...props }) => {
    const modifiedSrc = src ? nextImage(src, 512) : undefined;
    return <Image src={modifiedSrc} {...props} />;
};
