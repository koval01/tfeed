"use client";

import React, { useMemo, type PropsWithChildren } from "react";

import type { Channel, Footer, Media, Post, TitleProps } from "@/types";
import type { FooterComponentProps, PostBodyProps } from "@/types/feed/post";

import { useFormattedDate } from "@/hooks/utils/useFormattedDate";
import { useWindowSize } from "@/hooks/utils/useWindowSize";

import { cn } from "@/lib/utils/clsx";
import { Trans } from "react-i18next";

import { convertMediaArray } from "@/helpers/mediaConvert";
import { handleRedirect } from "@/lib/utils/handle";

import { t } from "i18next";

import {
    Icon16Verified,
    Icon16View,
    Icon20SignatureOutline,
    Icon24MessageReplyOutline,
    Icon24ShareOutline
} from "@vkontakte/icons";

import {
    Banner,
    Button,
    Caption,
    EllipsisText,
    Flex,
    Footnote,
    Headline,
    Spacing,
    Subhead,
    Tappable,
    Text,
    Tooltip,
} from "@vkontakte/vkui";

import { LazyImage as Image } from "@/components/media/LazyImage";

import { Avatar } from "@/components/avatar/Avatar";
import { NextImage } from "@/components/media/NextImage";
import { VKMediaGrid } from "@/components/media/Media";

import { AudioPost } from "@/components/feed/post/Audio";
import { PostReacts } from "@/components/feed/post/Reacts";
import { GifPost } from "@/components/feed/post/GifPost";
import { Poll } from "@/components/feed/post/Poll";
import { PreviewLink } from "@/components/feed/post/PreviewLink";
import { RoundVideo } from "@/components/feed/post/RoundVideo";
import { Sticker } from "@/components/feed/post/Sticker";
import { Verified } from "@/components/feed/post/Verified";
import { TextComponent } from "@/components/feed/TextComponent";

const usePostMediaCollection = (post: Post) => {
    return useMemo(() => {
        if (!post.content.media) return { mediaCollection: null, hasUnavailableMedia: false, unavailableMedia: undefined };

        const unavailableMedia = post.content.media.find((media) =>
            media?.url === undefined && media?.available === false
        );

        const filteredMedia = post.content.media.filter(
            (media): media is Media & { url: string; type: "video" | "image" } =>
                media?.url !== undefined && (media.type === "video" || media.type === "image")
        );

        return {
            mediaCollection: convertMediaArray(filteredMedia),
            hasUnavailableMedia: !!unavailableMedia,
            unavailableMedia
        };
    }, [post.content.media]);
};

const usePostAvailability = (post: Post) => {
    return useMemo(() => {
        const content = post.content;
        return !!(
            content.text?.string ||
            content.poll ||
            content.media?.some(media => [
                "video", "image", "roundvideo", "sticker", "gif", "voice", "audio"
            ].includes(media.type))
        );
    }, [post.content]);
};

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

const ChannelTitle = ({ channel }: { channel: Channel }) => {
    const titleContent = useMemo(() => (
        <EllipsisText className="max-sm:max-w-40 max-md:max-w-72 lg:max-w-[380px] md:max-w-[45vw]">
            <TextComponent htmlString={channel.title.html} />
        </EllipsisText>
    ), [channel.title.html]);

    const isVerified = useMemo(() => channel?.labels?.includes("verified") ?? false,
        [channel.labels]);

    return (
        <Title
            verified={isVerified}
            channelName={channel.title.string}
        >
            {titleContent}
        </Title>
    );
};

const HeadProfile = ({ channel, post }: PostBodyProps) => {
    const formattedDate = useFormattedDate(post.footer.date.unix);

    return (
        <div className="flex flex-col mr-2.5 whitespace-nowrap min-w-0 flex-auto">
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
        </div>
    );
};

const ShareButton = ({ channel, post }: { channel: Channel, post: Post }) => (
    <div className="relative">
        <Tooltip title={t("openPostInNewWindow")}>
            <Tappable
                onClick={() => handleRedirect(channel, post)}
                className="rounded-md"
                aria-label="Open post in new window"
            >
                <Icon24ShareOutline className="text-neutral-600" />
            </Tappable>
        </Tooltip>
    </div>
);

const TopButtons = ({ channel, post }: PostBodyProps) => (
    <div className="relative flex" style={{ flex: "0 0 auto" }}>
        <div className="flex items-center space-x-1">
            <ShareButton channel={channel} post={post} />
        </div>
    </div>
);

export const PostHeader = ({ channel, post }: PostBodyProps) => (
    <Flex className="flex-row select-none">
        <div className="mr-3">
            <Avatar src={channel.avatar} size={40} name={channel.title.string} />
        </div>
        <HeadProfile channel={channel} post={post} />
        <TopButtons channel={channel} post={post} />
    </Flex>
);

const PostViews = ({ views }: { views?: string }) => (
    views ? (
        <FooterComponent
            Icon={Icon16View}
            iconSize={15}
            context={views}
            className="space-x-0.5 md:space-x-1"
        />
    ) : null
);

const PostAuthor = ({ footer }: { footer?: Footer }) => (
    footer?.author ? (
        <FooterComponent
            Icon={Icon20SignatureOutline}
            context={<TextComponent htmlString={footer.author?.html} />}
            iconSize={19}
            className="space-x-1"
        />
    ) : (
        <div />
    )
);

export const PostFooter = ({ post }: { post: Post }) => {
    const memoizedAuthor = useMemo(() => (
        <PostAuthor footer={post.footer} />
    ), [post.footer]);

    const memoizedViews = useMemo(() => (
        <PostViews views={post.footer.views} />
    ), [post.footer.views]);

    return (
        <div className="py-0 select-none">
            <div className="flex items-center relative justify-between max-md:pt-0.5 pt-0 pb-0">
                {memoizedAuthor}
                <div className="inline-flex space-x-0.5 md:space-x-1">
                    {post.footer.edited &&
                        <Caption level="2" className="text-neutral-600 !leading-6">{t("edited")}</Caption>}
                    {memoizedViews}
                </div>
            </div>
        </div>
    );
};

const UnavailableMedia = ({ channel, post, media }: { channel: Channel, post: Post, media: Media | undefined }) => {
    const { isSm, isMd } = useWindowSize();

    return (
        <div className="block py-1 md:px-1.5">
            <div className="relative block w-full h-full select-none overflow-hidden mt-3 md:mt-4.5 rounded-2xl">
                <Image
                    className="absolute block blur-lg"
                    src={media?.thumb}
                    alt={"Round video preview"}
                    widthSize={"100%"}
                    heightSize={"100%"}
                    noBorder
                />
                <div className="absolute block bg-black/30 dark:bg-black/20 w-full h-full" />
                <div className="w-[1024px] pt-[56%]" />
                <div className="flex items-center justify-center h-full absolute top-0 left-0 right-0 bottom-0">
                    <div className="block">
                        <Headline
                            className="text-white text-center text-sm sm:text-base md:text-lg lg:text-base px-2 md:px-3"
                            level="2"
                        >
                            {t("mediaNotAvailable")}
                        </Headline>
                        <Button
                            className="block m-auto mt-1 invert dark:invert-0"
                            rounded
                            mode="outline"
                            size={isMd ? "l" : isSm ? "m" : "s"}
                            appearance="neutral"
                            onClick={() => handleRedirect(channel, post)}
                        >
                            <Footnote className="text-xs md:text-base" caps>
                                {t("viewInTelegram")}
                            </Footnote>
                        </Button>
                    </div>
                </div>
                <div
                    className="absolute z-[5] bottom-0 -right-2"
                    style={{
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    <div className="text-center text-white bg-black/30 rounded-lg backdrop-blur-md px-2 py-0 text-sm md:text-base">
                        {media?.duration.formatted}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PostMedia = ({ channel, post }: { channel: Channel, post: Post }) => {
    const { mediaCollection, hasUnavailableMedia, unavailableMedia } = usePostMediaCollection(post);

    if (hasUnavailableMedia) {
        return <UnavailableMedia media={unavailableMedia} channel={channel} post={post} />;
    }

    return mediaCollection ? <VKMediaGrid mediaCollection={mediaCollection} /> : null;
};

const PostText = ({ post }: { post: Post }) => {
    const text = post.content.text?.html;
    if (!text) return null;

    return (
        <div>
            <Footnote weight="2" className="whitespace-pre-line" useAccentWeight>
                <TextComponent htmlString={text} />
            </Footnote>
        </div>
    );
};

const PostPoll = ({ post }: { post: Post }) => (
    post.content.poll ? <Poll poll={post.content.poll} /> : null
);

const PostReply = ({ channel, post }: { channel: Channel, post: Post }) => {
    const reply = post.content.reply;

    const memoizedTitle = useMemo(() => (
        <Subhead
            weight="2"
            className="text-sm text-[--vkui--color_text_accent]"
            Component="h5"
            useAccentWeight>
            <EllipsisText>
                <TextComponent htmlString={reply?.name?.html} />
            </EllipsisText>
        </Subhead>
    ), [reply?.name]);

    const memoizedSubtitle = useMemo(() => (
        <span className="text-[13px]">
            <EllipsisText>
                {reply?.text ?
                    <TextComponent htmlString={reply.text.html} />
                    :
                    <span>{t("replyWithoutReply")}</span>
                }
            </EllipsisText>
        </span>
    ), [reply?.text]);

    if (!reply) return null;

    return (
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
                        {(reply.cover && !reply.cover.startsWith("data:image")) && <NextImage
                            size={44}
                            src={reply.cover}
                            alt={`Reply to ${reply.name}'s message`}
                        />}
                    </div>
                }
                title={memoizedTitle}
                subtitle={memoizedSubtitle}
            />
            <Spacing />
        </>
    );
};

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

const PostSupport = ({ children, post }: PropsWithChildren<{ post: Post }>) => {
    const isSupported = usePostAvailability(post);
    if (!isSupported) return <PostNotSupported />;
    return children;
};

const PostContentItems = ({ channel, post }: PostBodyProps) => (
    <>
        <PostReply channel={channel} post={post} />
        <PostText post={post} />
        <PostMedia channel={channel} post={post} />
        <PostPoll post={post} />
        <RoundVideo post={post} />
        <Sticker post={post} />
        <GifPost post={post} />
        <AudioPost post={post} />
        <PreviewLink post={post} />
        <PostReacts post={post} />
    </>
);

export const PostContent = ({ channel, post }: PostBodyProps) => (
    <PostSupport post={post}>
        <PostContentItems channel={channel} post={post} />
    </PostSupport>
);
