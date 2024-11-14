import { TextComponent } from "@/components/feed/TextComponent";
import formatDate from "@/helpers/date";
import { Post, TitleProps } from "@/types";
import { PostBodyProps } from "@/types/feed/post";
import { Icon16Verified, Icon16View, Icon24ShareOutline } from "@vkontakte/icons";
import { Caption, Flex, Headline, Subhead, Tappable } from "@vkontakte/vkui";
import { Avatar } from "@/components/Avatar";

const Title = ({ children, verified }: TitleProps) => (
    <>
        <Headline level="2" weight="1">{children}</Headline>
        {verified && <Icon16Verified className="align-top inline-block text-[--vkui--color_icon_accent] ml-1" />}
    </>
)

const HeadProfile = ({ channel, post }: PostBodyProps) => (
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
            <Avatar src={channel.avatar} size={40} name={channel.title} />
        </div>
        <HeadProfile channel={channel} post={post} />
        <MoreButton channel={channel} post={post} />
    </Flex>
)

const PostViews = ({ views }: { views?: string }) => (
    views && (
        <div className="flex items-center whitespace-nowrap overflow-hidden leading-[15px] h-3.5 vkuiPlaceholder__text">
            <span className="flex size-3.5 mr-1.5 vkuiPlaceholder__text">
                <Icon16View />
            </span>
            <Caption className="relative leading-[15px] h-3.5 text-sm/7 font-medium">
                {views}
            </Caption>
        </div>
    )
)

export const PostFooter = ({ post }: { post: Post }) => (
    <div className="py-0 select-none">
        <div className="flex items-center relative justify-between pt-3 pb-0">
            <PostViews views={post.footer.views} />
        </div>
    </div>
)

const PostMedia = ({ post }: { post: Post }) => <></>;

export const PostContent = ({ channel, post }: PostBodyProps) => (
    <>
        <TextComponent htmlString={post.content.text?.html} />
        <PostMedia post={post} />
    </>
)