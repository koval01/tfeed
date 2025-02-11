import type { Channel, TitleProps } from "@/types";
import React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { TextComponent } from "@/components/feed/TextComponent";
import { Verified } from "@/components/feed/post/Verified";

import { Icon16Verified } from "@vkontakte/icons";
import { Button, EllipsisText, Headline } from "@vkontakte/vkui";

import { t } from "i18next";
import { Trans } from "react-i18next";

/**
 * Renders a channel avatar.
 */
const NavAvatar: React.FC<{ channel: Channel }> = ({ channel }) => (
    <div className="inline-block items-baseline overflow-hidden float-left mr-2 relative">
        <Avatar src={channel.avatar} size={36} name={channel.title.string} />
    </div>
);

/**
 * Renders the title with optional verification badge.
 */
const Title: React.FC<TitleProps> = ({ children, verified }) => (
    <div className="inline-flex items-super text-sm font-medium relative -top-1">
        <div className="whitespace-nowrap text-ellipsis overflow-hidden">{children}</div>
        {verified && (
            <div className="inline-block overflow-hidden size-4 ml-1 leading-none">
                <Verified className="inline-flex text-[--vkui--color_icon_accent]" Icon={Icon16Verified} />
            </div>
        )}
    </div>
);

/**
 * Displays the subscriber count for a channel.
 */
const SubscribersCounter: React.FC<{ channel: Channel }> = ({ channel }) => (
    <div className="whitespace-nowrap text-ellipsis overflow-hidden text-[12px] leading-[14px] pb-1 relative -top-1 text-neutral-500">
        {channel.counters.subscribers} {t("subscribers")}
    </div>
);

/**
 * Renders the channel's title with optional HTML content.
 */
const ChannelTitle: React.FC<{ channel: Channel }> = ({ channel }) => (
    <Title verified={channel.labels.includes("verified")}>
        <EllipsisText className="max-w-[calc(50vw-52px)]">
            <TextComponent htmlString={channel.title.html} />
        </EllipsisText>
    </Title>
);

/**
 * Renders a subscription button that redirects to the channel's Telegram page.
 */
export const SubscribeButton: React.FC<{ channel: Channel }> = ({ channel }) => (
    <div className="block pr-1 w-full">
        <Button
            appearance="accent-invariable"
            size="s"
            onClick={() => window.open(`https://t.me/${channel.username}`, "_blank")}
            aria-label={t("Subscribe button")}
        >
            <Headline level="2" Component="h4">
                <Trans i18nKey="Subscribe" />
            </Headline>
        </Button>
    </div>
);

/**
 * Renders the navigation block for a channel, including avatar, title, and subscriber count.
 */
const Nav: React.FC<{ channel: Channel }> = ({ channel }) => (
    <div className="flex items-center relative justify-between space-x-2 overflow-hidden py-1.5 pl-[5px] md:pt-3">
        <div className="block select-none items-center min-w-40">
            <NavAvatar channel={channel} />
            <ChannelTitle channel={channel} />
            <SubscribersCounter channel={channel} />
        </div>
    </div>
);

/**
 * A wrapper for displaying channel navigation if the channel exists.
 */
export const ChannelNav: React.FC<{ channel?: Channel }> = ({ channel }) =>
    channel ? <Nav channel={channel} /> : null;
