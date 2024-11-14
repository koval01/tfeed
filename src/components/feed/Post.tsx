import { PostBodyProps, PostsProps } from "@/types/feed/post";

import { Forward } from "@/components/feed/Forward";
import { PostContent, PostFooter, PostHeader } from "@/components/feed/Body";

import { Group, SplitCol, Spacing, PullToRefresh } from "@vkontakte/vkui";

const PostBody = ({ channel, post }: PostBodyProps) => (
    post.forwarded ?
        <Forward post={post}>
            <PostContent channel={channel} post={post} />
        </Forward>
        :
        <PostContent channel={channel} post={post} />
)

export const Posts = ({ channel, posts, onRefresh, isFetching }: PostsProps) => (
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
