import type { FC } from "react";
import type { IconProps } from "@/types/icon";

import {
    ContentBadge,
    Footnote,
    type ContentBadgeProps as VKContentBadgeProps
} from "@vkontakte/vkui";

interface ContentBadgeProps extends VKContentBadgeProps {
    Icon?: FC<IconProps>;
    text?: string;
}

export const Badge = ({ Icon, text, ...props }: ContentBadgeProps) => (
    <ContentBadge {...props} className="select-none">
        {Icon && (
            <ContentBadge.SlotIcon>
                <Icon />
            </ContentBadge.SlotIcon>
        )}
        {text && (
            <Footnote weight="1" caps>
                {text}
            </Footnote>
        )}
    </ContentBadge>
);
