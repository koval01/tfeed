import { PropsWithChildren } from "react";

import type { Post, Forwarded } from "@/types";

import { Icon28ReplyOutline } from "@vkontakte/icons";
import { Avatar, EllipsisText, Headline, Link, Spacing, Subhead } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";
import { TextComponent } from "@/components/feed/TextComponent";

interface LinkPostProps extends PropsWithChildren {
    className?: string;
    forwarded: Forwarded;
}

const AvatarObject = () => (
    <Avatar fallbackIcon={<Icon28ReplyOutline style={{ margin: 0 }} />} className="!size-10" />
)

const LinkPost = ({ children, className, forwarded }: LinkPostProps) => (
    forwarded.url ? (
        <Link href={forwarded.url} className={className}>
            {children}
        </Link>
    ) : children
)

const ForwardName = ({ forwarded }: { forwarded: Forwarded }) => (
    <Headline>
        <EllipsisText className="text-[--vkui--color_text_accent]">
            <LinkPost className="text-[--vkui--color_text_accent]" forwarded={forwarded}>
                <TextComponent htmlString={forwarded.name.html} />
            </LinkPost>
        </EllipsisText>
    </Headline>
);

export const Forward = ({ children, post }: PropsWithChildren<{ post: Post }>) => { 
    const { t } = useTranslation();
    
    return(
    <div className="mt-3 pl-3 border-solid border-l-2 border-[#001433]/[.12] dark:border-white/[.24]">
        <div className="min-h-10">
            <div className="block float-left">
                <LinkPost forwarded={post.forwarded}><AvatarObject /></LinkPost>
            </div>
            <div className="ml-[52px] mt-[3px]">
                <ForwardName forwarded={post.forwarded} />
                <Subhead className="vkuiPlaceholder__text select-none">
                    {t("forwarded message")}
                </Subhead>
            </div>
        </div>
        <Spacing />
        {children}
        <Spacing size={6} />
    </div>
)
};
