import React, { memo, useMemo } from 'react';

import { Avatar, type AvatarProps } from "@vkontakte/vkui";
import { nextImage } from '@/helpers/nextImage';

interface NextAvatar extends AvatarProps {
    proxy?: boolean;
}

export const NextAvatar = memo(({
    src,
    size,
    proxy = false,
    ...props
}: NextAvatar) => {
    const modifiedSrc = useMemo(() => {
        return src ? nextImage(src as string, size as number) : undefined;
    }, [src, size]);

    return <Avatar src={proxy ? modifiedSrc : src} size={size} {...props} />;
});
NextAvatar.displayName = 'NextAvatar';
