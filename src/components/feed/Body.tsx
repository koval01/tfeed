import { FC } from "react";
import type { ClassValue } from "clsx";

import { cn } from "@/lib/utils";
import { Channel, Post, TitleProps } from "@/types";

import { useFormattedDate } from "@/hooks/useFormattedDate";

import { Icon16Verified, Icon16View, Icon20SignatureOutline, Icon24ShareOutline } from "@vkontakte/icons";
import { Caption, Flex, Footnote, Headline, Subhead, Tappable } from "@vkontakte/vkui";

import { Avatar } from "@/components/Avatar";
import { Verified } from "@/components/feed/Verified";
import { PostBodyProps } from "@/types/feed/post";
import { TextComponent } from "@/components/feed/TextComponent";

const Title = ({ children, verified, channelName }: TitleProps) => (
    <div className="overflow-hidden text-ellipsis leading-4 font-medium" style={{ display: "inherit", fontSize: "13px" }}>
        <Headline level="2" className="inline-flex max-w-full overflow-hidden text-ellipsis leading-4" style={{ fontSize: "13px" }}>
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
)

const ChannelTitle = ({ channel }: { channel: Channel }) => (
    <Title verified={channel.labels.includes("verified")} channelName={channel.title.string}>
        <TextComponent htmlString={channel.title.html} />
    </Title>
)

const HeadProfile = ({ channel, post }: PostBodyProps) => {
    const formattedDate = useFormattedDate(post.footer.date.unix);

    return (
        <div className="flex flex-col mr-2.5 whitespace-nowrap min-w-0 flex-auto">
            <div className="flex overflow-hidden text-ellipsis min-w-full items-center">
                <div className="inline-flex min-w-full">
                    <ChannelTitle channel={channel} />
                </div>
            </div>
            <Subhead className="vkuiPlaceholder__text overflow-hidden text-ellipsis font-normal" style={{ fontSize: "13px" }}>
                {formattedDate}
            </Subhead>
        </div>
    )
}

const MoreButton = ({ channel, post }: PostBodyProps) => (
    <div className="relative flex" style={{
        flex: "0 0 auto"
    }}>
        <div className="flex items-center">
            <div className="relative">
                <Tappable
                    onClick={() => window.open(`https://t.me/${channel.username}/${post.id}`, "_blank")}
                    className="rounded-lg"
                >
                    <Icon24ShareOutline className="vkuiPlaceholder__text" />
                </Tappable>
            </div>
        </div>
    </div>
)

export const PostHeader = ({ channel, post }: PostBodyProps) => (
    <Flex className="flex-row select-none">
        <div className="mr-3">
            <Avatar src={channel.avatar} size={40} name={channel.title.string} />
        </div>
        <HeadProfile channel={channel} post={post} />
        <MoreButton channel={channel} post={post} />
    </Flex>
)

const FooterComponent = ({ Icon, context, iconSize = 14, className }: { Icon: FC, context: string, iconSize?: number, className?: ClassValue }) => (
    <div className={cn("flex items-center whitespace-nowrap overflow-hidden leading-[15px] h-3.5 vkuiPlaceholder__text", className)}>
        <span className="flex vkuiPlaceholder__text" style={{ width: iconSize, height: iconSize }}>
            <Icon />
        </span>
        <Caption className="relative leading-[15px] h-3.5 text-sm/7 font-medium">
            {context}
        </Caption>
    </div>
)

const PostViews = ({ views }: { views?: string }) => (
    views && <FooterComponent Icon={Icon16View} context={views} className="space-x-1.5" />
)

const PostAuthor = ({ author }: { author?: string }) => (
    author ? <FooterComponent
        Icon={Icon20SignatureOutline}
        context={author}
        iconSize={16}
        className="space-x-1"
    /> : <div />
)

export const PostFooter = ({ post }: { post: Post }) => (
    <div className="py-0 select-none">
        <div className="flex items-center relative justify-between max-md:pt-1 pt-3 pb-0">
            <PostAuthor author={post.footer.author} />
            <PostViews views={post.footer.views} />
        </div>
    </div>
)

const PostMedia = ({ post }: { post: Post }) => <></>;

const PostText = ({ post }: { post: Post }) => (
    <div>
        <Footnote weight="2" className="whitespace-pre-line">
            <TextComponent htmlString={post.content.text?.html} />
        </Footnote>
    </div>
)

export const PostContent = ({ channel, post }: PostBodyProps) => (
    <>
        <PostText post={post} />
        <PostMedia post={post} />
    </>
)