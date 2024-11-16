import { PostBodyProps, PostsProps, PostProps, LoadingMoreProps } from "@/types/feed/post";

import { Forward } from "@/components/feed/Forward";
import { PostContent, PostFooter, PostHeader } from "@/components/feed/Body";

import { Group, SplitCol, Spacing, PullToRefresh, Button, Subhead } from "@vkontakte/vkui";

const PostBody = ({ channel, post }: PostBodyProps) => (
    post.forwarded ?
        <Forward post={post}>
            <PostContent channel={channel} post={post} />
        </Forward>
        :
        <PostContent channel={channel} post={post} />
)

const LoadingMoreButton = ({ isFetchingMore }: { isFetchingMore: boolean }) => (
    <div className="flex justify-center">
        <Button
            size="l"
            appearance="neutral"
            loading={isFetchingMore}
            disabled={isFetchingMore}
            className="min-w-28"
        >
            <Subhead weight="1" className="vkuiPlaceholder__text">
                Load more
            </Subhead>
        </Button>
    </div>
)

const LoadingMore = ({ isFetchingMore, noMorePosts }: LoadingMoreProps) => (
    <Group mode="plain" className="my-1 md:my-3 lg:my-5">
        {!noMorePosts && <LoadingMoreButton isFetchingMore={isFetchingMore} />}
    </Group>
)

const Post = ({ item, channel }: PostProps) => (
    <Group>
        <div className="py-2.5 px-4">
            <PostHeader channel={channel} post={item} />
            <Spacing />
            <PostBody channel={channel} post={item} />
            <Spacing />
            <PostFooter post={item} />
        </div>
    </Group>
)

export const Posts = ({ channel, posts, onRefresh, isFetching, isFetchingMore, noMorePosts }: PostsProps) => (
    <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
        <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
            {posts.map((item, index) => <Post key={index} item={item} channel={channel} />)}
            <LoadingMore isFetchingMore={isFetchingMore} noMorePosts={noMorePosts} />
        </PullToRefresh>
    </SplitCol>
);
