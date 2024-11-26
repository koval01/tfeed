"use client";

import type { PropsWithChildren } from "react";

import type { FooterComponentProps, PostBodyProps } from "@/types/feed/post";
import type { Channel, Footer, Post, TitleProps } from "@/types";

import { cn } from "@/lib/utils";
import { useFormattedDate } from "@/hooks/useFormattedDate";
import { Trans } from "react-i18next";

import {
    Icon16Verified,
    Icon16View,
    Icon20SignatureOutline,
    Icon24MessageReplyOutline,
    Icon24ShareOutline,
} from "@vkontakte/icons";

import {
    Banner,
    Caption,
    Div,
    EllipsisText,
    Flex,
    Footnote,
    Headline,
    Image,
    Separator,
    Spacing,
    Subhead,
    Tappable,
    Text,
} from "@vkontakte/vkui";

import { Avatar } from "@/components/Avatar";
import { Poll } from "@/components/feed/Poll";
import { VKMediaGrid } from "@/components/Media";
import { Verified } from "@/components/feed/Verified";
import { TextComponent } from "@/components/feed/TextComponent";

import { convertMediaArray } from "@/helpers/mediaConvert";

const handleRedirect = (channel: Channel, post: Post) =>
    window.open(`https://t.me/${channel.username}/${post.id}`, "_blank");

/**
 * Renders the title of a channel or post with optional verification status.
 */
const Title = ({ children, verified, channelName }: TitleProps) => (
    <div className="inline-flex overflow-hidden text-ellipsis text-[13px] leading-4 font-medium">
        <Headline level="2" className="inline-flex max-w-full overflow-hidden text-ellipsis text-[13px] leading-4">
            {children}
        </Headline>
        {verified && (
            <div className="inline-block align-middle items-center size-4 ml-1 leading-3">
                <Verified
                    className="inline-flex text-[--vkui--color_icon_accent]"
                    Icon={Icon16Verified}
                    channelName={channelName}
                />
            </div>
        )}
    </div>
);

/**
 * Displays the channel's title and verification status.
 */
const ChannelTitle = ({ channel }: { channel: Channel }) => (
    <Title
        verified={channel.labels.includes("verified")}
        channelName={channel.title.string}
    >
        <EllipsisText className="max-sm:max-w-40 max-md:max-w-72 lg:max-w-[380px] md:max-w-[60vw]">
            <TextComponent htmlString={channel.title.html} />
        </EllipsisText>
    </Title>
);

/**
 * Renders the profile header with channel title and post date.
 */
const HeadProfile = ({ channel, post }: PostBodyProps) => {
    const formattedDate = useFormattedDate(post.footer.date.unix);

    return (
        <div className="flex flex-col mr-2.5 whitespace-nowrap min-w-0 flex-auto">
            <div className="flex overflow-hidden text-ellipsis min-w-full items-center">
                <div className="inline-flex min-w-full">
                    <ChannelTitle channel={channel} />
                </div>
            </div>
            <Subhead className="vkuiPlaceholder__text overflow-hidden text-ellipsis font-normal text-[13px]">
                {formattedDate}
            </Subhead>
        </div>
    );
};

/**
 * Renders a "more" button to redirect to a post on Telegram.
 */
const MoreButton = ({ channel, post }: PostBodyProps) => (
    <div className="relative flex" style={{ flex: "0 0 auto" }}>
        <div className="flex items-center">
            <div className="relative">
                <Tappable onClick={() => handleRedirect(channel, post)} className="rounded-lg">
                    <Icon24ShareOutline className="vkuiPlaceholder__text" />
                </Tappable>
            </div>
        </div>
    </div>
);

/**
 * Renders the post header with an avatar, profile information, and more button.
 */
export const PostHeader = ({ channel, post }: PostBodyProps) => (
    <Flex className="flex-row select-none">
        <div className="mr-3">
            <Avatar src={channel.avatar} size={40} name={channel.title.string} />
        </div>
        <HeadProfile channel={channel} post={post} />
        <MoreButton channel={channel} post={post} />
    </Flex>
);

/**
 * Generic footer component for displaying icon and context text.
 */
const FooterComponent = ({
    Icon,
    context,
    iconSize = 14,
    className,
}: FooterComponentProps) => (
    <div
        className={cn(
            "flex items-center whitespace-nowrap overflow-hidden leading-5 h-6 vkuiPlaceholder__text",
            className
        )}
    >
        <span className="flex vkuiPlaceholder__text" style={{ width: iconSize, height: iconSize }}>
            <Icon />
        </span>
        <Caption className="relative leading-[15px] h-3.5 text-sm/7 font-medium">
            {context}
        </Caption>
    </div>
);

/**
 * Displays the view count in the post footer.
 */
const PostViews = ({ views }: { views?: string }) =>
    views ? <FooterComponent Icon={Icon16View} context={views} className="space-x-1.5" /> : null;

/**
 * Displays the author in the post footer.
 */
const PostAuthor = ({ footer }: { footer?: Footer }) =>
    footer?.author ? (
        <FooterComponent
            Icon={Icon20SignatureOutline}
            context={<TextComponent htmlString={footer.author?.html} />}
            iconSize={19}
            className="space-x-1"
        />
    ) : (
        <div />
    );

/**
 * Renders the footer of the post with author and view count.
 */
export const PostFooter = ({ post }: { post: Post }) => (
    <div className="py-0 select-none">
        <div className="flex items-center relative justify-between max-md:pt-1 pt-3 pb-0">
            <PostAuthor footer={post.footer} />
            <PostViews views={post.footer.views} />
        </div>
    </div>
);

/**
 * Renders media content in the post.
 */
const PostMedia = ({ post }: { post: Post }) => {
    if (!post.content.media) return null;
    const mediaCollection = convertMediaArray(post.content.media);
    return <VKMediaGrid mediaCollection={mediaCollection} />;
};

/**
 * Renders the text content of the post.
 */
const PostText = ({ post }: { post: Post }) => (
    <div>
        <Footnote weight="2" className="whitespace-pre-line">
            <TextComponent htmlString={post.content.text?.html} />
        </Footnote>
    </div>
);

/**
 * Renders a poll in the post if it exists.
 */
const PostPoll = ({ post }: { post: Post }) =>
    post.content.poll ? <Poll poll={post.content.poll} /> : null;


const PostReply = ({ channel, post }: { channel: Channel, post: Post }) => {
    const reply = post.content.reply;

    return reply &&
        (
            <Banner
                className="select-none my-1.5 md:my-2"
                asideMode="expand"
                onClick={() => handleRedirect(channel, post)}
                before={
                    <div className="inline-flex items-center space-x-2">
                        <Icon24MessageReplyOutline
                            width={26}
                            height={26}
                            className="text-[--vkui--color_text_accent]"
                        />
                        {post.content.reply.cover && <Image
                            size={40}
                            src={reply.cover}
                            alt={`Reply to ${reply.name}'s message`}
                        />}
                    </div>
                }
                header={
                    <Subhead weight="2" className="text-sm text-[--vkui--color_text_accent]">
                        <TextComponent htmlString={reply.name?.html} />
                    </Subhead>
                }
                subheader={
                    <span className="text-[13px]">
                        <EllipsisText>
                            <TextComponent htmlString={reply.text?.html} />
                        </EllipsisText>
                    </span>
                }
            />
        )
}

/**
 * This is a component that is a decorative cap for a post that is not supported
 */
const PostNotSupported = () => (
    <div>
        <Text className="text-lg font-bold TFeed__GradientText">
            <Trans i18nKey="thisPostNotSupported" />
        </Text>
        <Caption level="1" className="vkuiPlaceholder__text">
            <Trans
                i18nKey="openPostInTelegramHint"
                components={{ div: <Icon24ShareOutline className="inline-block text-[#24a1de]" width={13} height={13} /> }}
            />
        </Caption>
    </div>
);

/**
 * This component is a wrapper that decides whether to display a message about unsupported content
 */
const PostSupport = ({ children, post }: PropsWithChildren<{ post: Post }>) => {
    const content = post.content;
    const isSupported = !!(
        content.text?.string ||
        content.poll ||
        content.media?.some(media => media.type === 'video' || media.type === 'image')
    );

    return isSupported ? children : <PostNotSupported />
}

/**
 * Renders the main content of the post, including text, media, and poll.
 */
export const PostContent = ({ channel, post }: PostBodyProps) => (
    <PostSupport post={post}>
        <PostReply channel={channel} post={post} />
        <PostText post={post} />
        <PostMedia post={post} />
        <PostPoll post={post} />
    </PostSupport>
);
