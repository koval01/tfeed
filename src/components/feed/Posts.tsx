import formatDate from "@/helpers/date";

import { Body, Channel, Post, TitleProps } from "@/types";

import { Icon16Verified, Icon16View, Icon24MoreHorizontal } from "@vkontakte/icons";
import { Group, SplitCol, Flex, Avatar, Subhead, Headline, Footnote, Tappable, Spacing, Caption, PullToRefresh } from "@vkontakte/vkui";

function Title({ children, verified }: TitleProps) {
    return (
        <>
            <Headline level="2" weight="1">{children}</Headline>
            {verified && <Icon16Verified className="align-top inline-block text-[--vkui--color_icon_accent] ml-1" />
            }
        </>
    )
}

function HeadProfile({ channel, post }: { channel: Channel, post: Post }) {
    return (
        <div className="flex flex-col mr-2.5 whitespace-nowrap min-w-0 flex-auto">
            <div className="flex overflow-hidden text-ellipsis min-w-full items-center">
                <div className="inline-flex min-w-full">
                    <Title verified={channel.labels.includes("verified")}>{channel.title}</Title>
                </div>
            </div>
            <Subhead className="vkuiPlaceholder__text">
                {formatDate(post.footer.date.unix)}
            </Subhead>
        </div>
    )
}

function MoreButton() {
    return (
        <div className="relative flex" style={{
            flex: "0 0 auto"
        }}>
            <div className="flex items-center">
                <div className="relative">
                    <Tappable
                        onClick={console.log}
                        className="rounded-lg"
                    >
                        <Icon24MoreHorizontal className="vkuiPlaceholder__text" />
                    </Tappable>
                </div>
            </div>
        </div>
    )
}

function PostHeader({ channel, post }: { channel: Channel, post: Post }) {
    return (
        <Flex className="flex-row select-none">
            <Avatar src={channel.avatar} size={40} className="mr-3" />
            <HeadProfile channel={channel} post={post} />
            <MoreButton />
        </Flex>
    )
}

function PostFooter({ post }: { post: Post }) {
    return (
        <div className="py-0 select-none">
            <div className="flex items-center relative justify-between pt-3 pb-0">
                <div></div>
                <div className="flex items-center whitespace-nowrap overflow-hidden leading-[15px] h-3.5 vkuiPlaceholder__text">
                    <span className="flex size-3.5 mr-1.5 vkuiPlaceholder__text">
                        <Icon16View />
                    </span>
                    <Caption className="leading-[15px] h-3.5 text-sm/7 font-medium">
                        {post.footer.views}
                    </Caption>
                </div>
            </div>
        </div>
    )
}

function PostMedia({ post }: { post: Post }) {
    return <></>;
}

function PostBody({ channel, post }: { channel: Channel, post: Post }) {
    return (
        <>
            <Footnote weight="2" className="whitespace-pre-line">
                {post.content.text?.string}
            </Footnote>
            <PostMedia post={post} />
        </>
    )
}

export function Posts({ channel, posts, onRefresh, isFetching }: { channel: Channel, posts: Post[], onRefresh: () => void, isFetching: boolean }) {
    return (
        <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
            <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
                {posts.map((item, index) => (
                    <Group key={index}>
                        <div className="py-2.5 px-4">
                            <PostHeader channel={channel} post={item} />
                            <Spacing />
                            <PostBody channel={channel} post={item} />
                            <Spacing />
                            <PostFooter post={item} />
                        </div>
                    </Group>
                ))}
            </PullToRefresh>
        </SplitCol>
    );
}
