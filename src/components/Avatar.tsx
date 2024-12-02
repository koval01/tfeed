import React from "react";
import type { AvatarProps as VKAvatarProps } from "@vkontakte/vkui";

import { getInitials, stringToHash } from "@/helpers/string";
import { NextAvatar } from "@/components/NextAvatar";

interface AvatarProps extends VKAvatarProps {
    size?: number;
    src?: string;
    name?: string;
    proxy?: boolean
}

export const Avatar = React.memo(({ size = 48, src, name, proxy = false }: AvatarProps) => {
    const color = Math.abs(stringToHash(name || "Nothing") % 6) + 1 as 1 | 2 | 3 | 4 | 5 | 6;
    return <NextAvatar size={size} src={src} proxy={proxy} initials={getInitials(name)} gradientColor={color} />
});

Avatar.displayName = "Avatar";
