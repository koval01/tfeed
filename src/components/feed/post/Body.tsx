"use client";

import React, { type PropsWithChildren } from "react";

import type { Channel, Footer, Post, TitleProps } from "@/types";
import type { FooterComponentProps, PostBodyProps } from "@/types/feed/post";

import { useFormattedDate } from "@/hooks/utils/useFormattedDate";
import { cn } from "@/lib/utils/clsx";
import { Trans } from "react-i18next";

import {
    Icon16Verified,
    Icon16View,
    Icon20SignatureOutline,
    Icon24MessageReplyOutline,
    Icon24ShareOutline
} from "@vkontakte/icons";

import {
    Banner,
    Caption,
    EllipsisText,
    Flex,
    Footnote,
    Headline,
    Image,
    Spacing,
    Subhead,
    Tappable,
    Text,
} from "@vkontakte/vkui";

import { Avatar } from "@/components/avatar/Avatar";
import { VKMediaGrid } from "@/components/media/Media";

import { AudioPost } from "@/components/feed/post/Audio";
import { GifPost } from "@/components/feed/post/GifPost";
import { Poll } from "@/components/feed/post/Poll";
import { PreviewLink } from "@/components/feed/post/PreviewLink";
import { RoundVideo } from "@/components/feed/post/RoundVideo";
import { Sticker } from "@/components/feed/post/Sticker";
import { Verified } from "@/components/feed/post/Verified";
import { TextComponent } from "@/components/feed/TextComponent";

import { convertMediaArray } from "@/helpers/mediaConvert";
import { t } from "i18next";

const handleRedirect = (channel: Channel, post: Post) =>
    window.open(`https://t.me/${channel.username}/${post.id}`, "_blank");

/**
 * Renders the title of a channel or post with optional verification status.
 */
const Title = ({ children, verified, channelName }: TitleProps) => (
    <div className="inline-flex overflow-hidden text-ellipsis text-[13px] leading-4 font-medium">
        <Headline
            level="2"
            className="inline-flex max-w-full overflow-hidden text-ellipsis text-[13px] leading-4"
            Component="h4">
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
        <EllipsisText className="max-sm:max-w-40 max-md:max-w-72 lg:max-w-[380px] md:max-w-[45vw]">
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
        (<div className="flex flex-col mr-2.5 whitespace-nowrap min-w-0 flex-auto">
            <div className="flex overflow-hidden text-ellipsis min-w-full items-center">
                <div className="inline-flex min-w-full">
                    <ChannelTitle channel={channel} />
                </div>
            </div>
            <Subhead
                className="text-neutral-600 overflow-hidden text-ellipsis font-normal text-[13px]"
                Component="h5">
                {formattedDate}
            </Subhead>
        </div>)
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
                    <Icon24ShareOutline className="text-neutral-600" />
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
            "flex items-center whitespace-nowrap overflow-hidden leading-5 h-6 text-neutral-600",
            className
        )}
    >
        <span className="flex text-neutral-600 max-md:!w-3" style={{ width: iconSize, height: iconSize }}>
            <Icon />
        </span>
        <Caption className="relative leading-[15px] h-3.5 text-sm/7 max-md:text-xs font-medium">
            {context}
        </Caption>
    </div>
);

/**
 * Displays the view count in the post footer.
 */
const PostViews = ({ views }: { views?: string }) =>
    views ? <FooterComponent Icon={Icon16View} iconSize={15} context={views} className="space-x-0.5 md:space-x-1" /> : null;

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
        <div className="flex items-center relative justify-between max-md:pt-0.5 pt-0 pb-0">
            <PostAuthor footer={post.footer} />
            <div className="inline-flex space-x-0.5 md:space-x-1">
                {post.footer.edited ? 
                    <Caption level="2" className="text-neutral-600 !leading-6">{t("edited")}</Caption> 
                : null}
                <PostViews views={post.footer.views} />
            </div>
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
        <Footnote weight="2" className="whitespace-pre-line" useAccentWeight>
            <TextComponent htmlString={post.content.text?.html} />
        </Footnote>
    </div>
);

/**
 * Renders a poll in the post if it exists.
 */
const PostPoll = ({ post }: { post: Post }) =>
    post.content.poll ? <Poll poll={post.content.poll} /> : null;


/**
 * The component that is responsible for replies to other posts
 */
const PostReply = ({ channel, post }: { channel: Channel, post: Post }) => {
    const reply = post.content.reply;

    return reply &&
        (
            <>
                <Banner
                    className="select-none my-1.5 md:my-2"
                    after="chevron"
                    onClick={() => handleRedirect(channel, post)}
                    before={
                        <div className="inline-flex items-center space-x-2">
                            <Icon24MessageReplyOutline
                                width={26}
                                height={26}
                                className="text-[--vkui--color_text_accent]"
                            />
                            {post.content.reply.cover && <Image
                                size={44}
                                src={reply.cover}
                                alt={`Reply to ${reply.name}'s message`}
                            />}
                        </div>
                    }
                    title={
                        <Subhead
                            weight="2"
                            className="text-sm text-[--vkui--color_text_accent]"
                            Component="h5"
                            useAccentWeight>
                            <EllipsisText>
                                <TextComponent htmlString={reply.name?.html} />
                            </EllipsisText>
                        </Subhead>
                    }
                    subtitle={
                        <span className="text-[13px]">
                            <EllipsisText>
                                {reply.text ? 
                                    <TextComponent htmlString={reply.text?.html} /> 
                                    : 
                                    <span>{t("replyWithoutReply")}</span>
                                }
                            </EllipsisText>
                        </span>
                    }
                />
                <Spacing />
            </>
        );
}

/**
 * This is a component that is a decorative cap for a post that is not supported
 */
const PostNotSupported = () => (
    <div>
        <Text className="text-lg font-bold TFeed__GradientText">
            <Trans i18nKey="thisPostNotSupported" />
        </Text>
        <Caption level="1" className="text-neutral-600">
            <Trans
                i18nKey="openPostInTelegramHint"
                components={{ 
                    div: <Icon24ShareOutline 
                        key={`icon__key_${Math.random()}`} 
                        className="inline-block text-[#24a1de]" 
                        width={13} 
                        height={13} /> 
                }}
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
        content.media?.some(media => [
            "video", "image", "roundvideo", "sticker", "gif", "voice", "audio"
        ].includes(media.type))
    );

    return isSupported ? children : <PostNotSupported />
}

/**
 * Renders the main content of the post, including text, media, and poll.
 */
export const PostContent = React.memo(({ channel, post }: PostBodyProps) => (
    <PostSupport post={post}>
        <PostReply channel={channel} post={post} />
        <PostText post={post} />
        <PostMedia post={post} />
        <PostPoll post={post} />
        <RoundVideo post={post} />
        <Sticker post={post} />
        <GifPost post={post} />
        <AudioPost post={post} />
        <PreviewLink post={post} />
    </PostSupport>
));
