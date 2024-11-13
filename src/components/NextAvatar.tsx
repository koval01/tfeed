import React from 'react';

import { Avatar, AvatarProps } from "@vkontakte/vkui";
import { nextImage } from '@/helpers/nextImage';

export const NextAvatar: React.FC<AvatarProps> = ({ src, size, ...props }) => {
    const modifiedSrc = src ? nextImage(src, size as number) : undefined;
    return <Avatar src={modifiedSrc} size={size} {...props} />;
};
