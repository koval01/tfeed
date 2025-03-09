import React from "react";

import type { Forwarded, Post } from "@/types";
import type { PropsWithChildren } from "react";

import { Icon28ReplyOutline } from "@vkontakte/icons";
import { Avatar, EllipsisText, Headline, Link, Spacing, Subhead } from "@vkontakte/vkui";

import { TextComponent } from "@/components/feed/TextComponent";
import { Trans } from "react-i18next";

/**
 * Props for the `LinkPost` component.
 */
interface LinkPostProps extends PropsWithChildren {
    /** Optional CSS class for styling. */
    className?: string;
    /** Forwarded object containing the URL and name details. */
    forwarded: Forwarded;
}

/**
 * Renders an avatar with a fallback icon.
 */
const AvatarObject: React.FC = () => (
    <Avatar
        fallbackIcon={<Icon28ReplyOutline style={{ margin: 0 }} />}
        className="!size-10"
    />
);

/**
 * Wraps children with a link if a URL is provided in the `forwarded` prop.
 */
const LinkPost: React.FC<LinkPostProps> = ({ children, className, forwarded }) =>
    forwarded.url ? (
        <Link href={forwarded.url} className={className}>
            {children}
        </Link>
    ) : (
        <>{children}</>
    );

/**
 * Renders the name of the forwarded message with a link if available.
 */
const ForwardName: React.FC<{ forwarded: Forwarded }> = ({ forwarded }) => (
    <Headline Component="h4">
        <EllipsisText className="text-[--vkui--color_text_accent]">
            <LinkPost className="text-[--vkui--color_text_accent]" forwarded={forwarded}>
                <TextComponent htmlString={forwarded.name.html} />
            </LinkPost>
        </EllipsisText>
    </Headline>
);

/**
 * The `Forward` component renders forwarded message details along with its children.
 */
export const Forward: React.FC<PropsWithChildren<{ post: Post }>> = ({ children, post }) => (
    <div className="mt-3 pl-3 border-solid border-l-2 border-[#001433]/[.12] dark:border-white/[.24]">
        <div className="min-h-10">
            <div className="block float-left">
                <LinkPost forwarded={post.forwarded}>
                    <AvatarObject />
                </LinkPost>
            </div>
            <div className="ml-[52px] mt-[3px]">
                <ForwardName forwarded={post.forwarded} />
                <Subhead className="text-neutral-600 select-none" Component="h5">
                    <Trans i18nKey="forwarded message" />
                </Subhead>
            </div>
        </div>
        <Spacing />
        {children}
        <Spacing size={6} />
    </div>
);
