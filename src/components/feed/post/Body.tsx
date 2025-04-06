"use client";

import React, { 
    memo, 
    useCallback, 
    useContext, 
    useEffect, 
    useMemo, 
    useRef, 
    useState, 
    type PropsWithChildren 
} from "react";

import type { Channel, Footer, Post, TitleProps } from "@/types";
import type { FooterComponentProps, PostBodyProps } from "@/types/feed/post";

import Markdown from 'react-markdown'

import { useFormattedDate } from "@/hooks/utils/useFormattedDate";
import { useIntelligence } from "@/hooks/services/useIntelligence";

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
    Caption,
    EllipsisText,
    Flex,
    Footnote,
    Headline,
    Image,
    Paragraph,
    Skeleton,
    Spacing,
    Subhead,
    Tappable,
    Text,
    Tooltip,
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

import { Icons } from "@/components/ui/Icons";

import { DEFAULT_AI_STATE, PostAiContext } from "@/contexts/PostAiContext";

/**
 * Renders the title of a channel or post with optional verification status.
 */
const Title = memo(({ children, verified, channelName }: TitleProps) => (
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
));
Title.displayName = "Title";

/**
 * Displays the channel's title and verification status.
 */
const ChannelTitle = memo(({ channel }: { channel: Channel }) => {
    const titleContent = useMemo(() => (
        <EllipsisText className="max-sm:max-w-40 max-md:max-w-72 lg:max-w-[380px] md:max-w-[45vw]">
            <TextComponent htmlString={channel.title.html} />
        </EllipsisText>
    ), [channel.title.html]);

    return (
        <Title
            verified={channel.labels.includes("verified")}
            channelName={channel.title.string}
        >
            {titleContent}
        </Title>
    );
});
ChannelTitle.displayName = "ChannelTitle";

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
 * Renders top buttons on post component
 */
const TopButtons = memo(({ channel, post }: PostBodyProps) => {
    const { fetchIntelligence, isLoading } = useIntelligence();
    const { states, setAiState } = useContext(PostAiContext);

    const currentAiState = states[post.id] || DEFAULT_AI_STATE;
    const showAIButton = !currentAiState.result || currentAiState.error;

    const handleAIClick = useCallback(async () => {
        if (!showAIButton || isLoading) return;

        setAiState(post.id, {
            triggered: true,
            result: null,
            error: false,
            cachedHeight: void 0
        });

        try {
            const response = await fetchIntelligence(channel.username, post.id);
            const text = response?.ai?.text;
            setAiState(post.id, {
                triggered: true,
                result: text || null,
                error: false
            });
        } catch (err) {
            setAiState(post.id, {
                triggered: true,
                error: true,
                result: null
            });
            console.error("Error generating AI response.");
        }
    }, [channel.username, post.id, fetchIntelligence, setAiState, showAIButton, isLoading]);

    return (
        <div className="relative flex" style={{ flex: "0 0 auto" }}>
            <div className="flex items-center space-x-1">
                {showAIButton && (
                    <div className="relative">
                        <Tooltip title={t("buttonForCallAi")}>
                            <Tappable
                                onClick={handleAIClick}
                                className="rounded-md"
                                disabled={isLoading}
                                aria-label="Generate AI summary"
                            >
                                <Icons.aiIcon className={cn(
                                    "transition-opacity duration-300 delay-75 ease-out size-6",
                                    isLoading ? "opacity-40" : "opacity-100"
                                )} />
                            </Tappable>
                        </Tooltip>
                    </div>
                )}
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
            </div>
        </div>
    );
});
TopButtons.displayName = "TopButtons";

/**
 * Renders the post header with an avatar, profile information, and more button.
 */
export const PostHeader = ({ channel, post }: PostBodyProps) => (
    <Flex className="flex-row select-none">
        <div className="mr-3">
            <Avatar src={channel.avatar} size={40} name={channel.title.string} />
        </div>
        <HeadProfile channel={channel} post={post} />
        <TopButtons channel={channel} post={post} />
    </Flex>
);

/**
 * Generic footer component for displaying icon and context text.
 */
const FooterComponent = memo(({
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
));
FooterComponent.displayName = "FooterComponent";

/**
 * Displays the view count in the post footer.
 */
const PostViews = memo(({ views }: { views?: string }) =>
    views ? <FooterComponent Icon={Icon16View} iconSize={15} context={views} className="space-x-0.5 md:space-x-1" /> : null
);
PostViews.displayName = "PostViews";

/**
 * Displays the author in the post footer.
 */
const PostAuthor = memo(({ footer }: { footer?: Footer }) =>
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
PostAuthor.displayName = "PostAuthor";

/**
 * Renders the footer of the post with author and view count.
 */
export const PostFooter = memo(({ post }: { post: Post }) => (
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
));
PostFooter.displayName = "PostFooter";

/**
 * Renders media content in the post.
 */
const PostMedia = memo(({ post }: { post: Post }) => {
    const mediaCollection = useMemo(() =>
        post.content.media ? convertMediaArray(post.content.media) : null,
        [post.content.media]
    );

    return mediaCollection ? <VKMediaGrid mediaCollection={mediaCollection} /> : null;
});
PostMedia.displayName = "PostMedia";

/**
 * Renders the text content of the post.
 */
const PostText = memo(({ post }: { post: Post }) => (
    post.content.text?.html ? (
        <div>
            <Footnote weight="2" className="whitespace-pre-line" useAccentWeight>
                <TextComponent htmlString={post.content.text.html} />
            </Footnote>
        </div>
    ) : null
));
PostText.displayName = "PostText";

/**
 * Renders a poll in the post if it exists.
 */
const PostPoll = memo(({ post }: { post: Post }) =>
    post.content.poll ? <Poll poll={post.content.poll} /> : null
);
PostPoll.displayName = "PostPoll";


/**
 * The component that is responsible for replies to other posts
 */
const PostReply = memo(({ channel, post }: { channel: Channel, post: Post }) => {
    const reply = post.content.reply;
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
                        {reply.cover && <Image
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
                                <TextComponent htmlString={reply.text.html} />
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
});
PostReply.displayName = "PostReply";

/**
 * This is a component that is a decorative cap for a post that is not supported
 */
const PostNotSupported = memo(() => (
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
));
PostNotSupported.displayName = "PostNotSupported";

/**
 * This component is a wrapper that decides whether to display a message about unsupported content
 */
const PostSupport = memo(({ children, post }: PropsWithChildren<{ post: Post }>) => {
    const isSupported = useMemo(() => {
        const content = post.content;
        return !!(
            content.text?.string ||
            content.poll ||
            content.media?.some(media => [
                "video", "image", "roundvideo", "sticker", "gif", "voice", "audio"
            ].includes(media.type))
        );
    }, [post.content]);

    return isSupported ? children : <PostNotSupported />
});
PostSupport.displayName = "PostSupport";

const AIBlock = memo(({ postId }: { postId: number }) => {
    const { states, setAiState } = useContext(PostAiContext);
    const aiState = states[postId] || DEFAULT_AI_STATE;
    const contentRef = useRef<HTMLDivElement>(null);

    const [contentHeight, setContentHeight] = useState<string>('0');
    const [skipAnimation, setSkipAnimation] = useState(!!aiState.cachedHeight);

    useEffect(() => {
        if (!contentRef.current) return;

        if (aiState.cachedHeight) {
            setContentHeight(aiState.cachedHeight);
            setSkipAnimation(true);
            return;
        }

        const newHeight = aiState.triggered
            ? (aiState.result || aiState.error
                ? `${contentRef.current.scrollHeight}px`
                : '150px')
            : '0';

        setContentHeight(newHeight);

        if (aiState.triggered && aiState.result && !aiState.cachedHeight) {
            const timer = setTimeout(() => {
                setAiState(postId, {
                    ...aiState,
                    cachedHeight: newHeight
                });
                setSkipAnimation(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [aiState, postId, setAiState]);

    return (
        <div className={cn(
            "relative p-1 md:p-2 mb-1 md:mb-2",
            { 'block': aiState.triggered, 'hidden': !aiState.triggered }
        )}>
            <div className={cn(
                "ai__background_color w-full relative block",
                "px-1.5 sm:px-2 md:px-2.5 py-2 md:py-3",
                "rounded-md md:rounded-xl",
                "overflow-hidden",
                {
                    'bg-red-50 border border-red-200': aiState.error,
                    'bg-blue-50': !aiState.error
                }
            )}>
                <div
                    ref={contentRef}
                    className="overflow-hidden"
                    style={{
                        maxHeight: contentHeight,
                        transition: skipAnimation
                            ? 'none'
                            : 'max-height 500ms cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {aiState.result ? (
                        <div className="space-y-2 md:space-y-3">
                            <Paragraph>
                                <Markdown>{aiState.result}</Markdown>
                            </Paragraph>
                            <Subhead className="opacity-60 select-none">
                                <Trans i18nKey="answerGeneratedBy" components={{
                                    highlight: <span className="ai__text_color" />
                                }} />
                            </Subhead>
                        </div>
                    ) : aiState.error ? (
                        <Footnote caps>
                            {t("errorRequestAi")}
                        </Footnote>
                    ) : (
                        <div className="space-y-2">
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
AIBlock.displayName = "AIBlock";

/**
 * Renders the main content of the post, including text, media, and poll.
 */
export const PostContent = memo(({ channel, post }: PostBodyProps) => (
    <PostSupport post={post}>
        <AIBlock postId={post.id} />
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
PostContent.displayName = "PostContent";
