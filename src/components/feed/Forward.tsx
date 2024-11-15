import { PropsWithChildren } from "react";

import type { Post, Forwarded } from "@/types";

import { Icon28ReplyOutline } from "@vkontakte/icons";
import { Avatar, Headline, Link, Spacing, Subhead } from "@vkontakte/vkui";

interface LinkPostProps extends PropsWithChildren {
    className?: string;
    forwarded: Forwarded;
}

const AvatarObject = () => (
    <Avatar width={24} height={24} fallbackIcon={<Icon28ReplyOutline style={{ margin: 0 }} />} />
)

const LinkPost = ({ children, className, forwarded }: LinkPostProps) => (
    forwarded.url ? (
        <Link href={forwarded.url} className={className}>
            {children}
        </Link>
    ) : children
)

export const Forward = ({ children, post }: PropsWithChildren<{ post: Post }>) => (
    <div className="mt-3 pl-3 border-solid border-l-2 border-[#001433]/[.12] dark:border-white/[.24]">
        <div className="min-h-10">
            <div className="block float-left">
                <LinkPost forwarded={post.forwarded}><AvatarObject /></LinkPost>
            </div>
            <div className="ml-[52px] mt-[3px]">
                <Headline>
                    <LinkPost className="text-[--vkui--color_text_accent]" forwarded={post.forwarded}>
                        {post.forwarded.name}
                    </LinkPost>
                </Headline>
                <Subhead className="vkuiPlaceholder__text select-none">
                    forwarded message
                </Subhead>
            </div>
        </div>
        <Spacing />
        {children}
        <Spacing />
    </div>
);
