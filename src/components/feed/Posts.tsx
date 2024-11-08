import formatDate from "@/helpers/date";
import { Body, Channel, Post, TitleProps } from "@/types";
import { Icon16Verified, Icon24MoreHorizontal } from "@vkontakte/icons";

import { Group, SplitCol, Flex, Avatar, Subhead, Headline, Footnote, Tappable, Spacing } from "@vkontakte/vkui";

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

export function Posts({ data }: { data: Body }) {
    const posts = data.content.posts.slice().reverse();

    return (
        <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
            {posts.map((item, index) => (
                <Group key={index}>
                    <div className="py-2.5 px-4">
                        <PostHeader channel={data.channel} post={item} />
                        <Spacing />
                        <Footnote key={index} weight="2" className="whitespace-pre-line">
                            {item.content.text.string}
                        </Footnote>
                    </div>
                </Group>
            ))}
        </SplitCol>
    );
}
