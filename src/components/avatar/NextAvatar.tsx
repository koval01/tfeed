import React from 'react';

import { Avatar, type AvatarProps } from "@vkontakte/vkui";
import { nextImage } from '@/helpers/nextImage';

interface NextAvatar extends AvatarProps {
    proxy?: boolean
}

export const NextAvatar: React.FC<NextAvatar> = ({ src, size, proxy = false, ...props }) => {
    const modifiedSrc = src ? nextImage(src, size as number) : undefined;
    return <Avatar src={proxy ? modifiedSrc : src} size={size} {...props} />;
};
