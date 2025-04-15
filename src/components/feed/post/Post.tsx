"use client";

import { type JSX, memo, useCallback, useRef } from "react";

import type {
    PostBodyProps,
    PostProps,
    PostsProps
} from "@/types/feed/post";

import type {
    Post as PostInterface
} from "@/types";

import VirtualizedListWrapper from "@/components/feed/VirtualizedListWrapper";

import {
    Group,
    PullToRefresh,
    Spacing,
    SplitCol
} from "@vkontakte/vkui";

import {
    PostContent,
    PostFooter,
    PostHeader
} from "@/components/feed/post/Body";

import { useAnalytics } from "@/hooks/services/useAnalytics";
import { InView } from "react-intersection-observer";

import { Forward } from "@/components/feed/post/Forward";

import { MediaProvider } from "@/contexts/MediaContext";
import { PostAiProvider } from "@/contexts/PostAiContext";
import { InfiniteFeedLoader } from "./Footer";

/**
 * Displays the content of a single post, including forwarded content if applicable.
 */
const PostBody = ({ channel, post }: PostBodyProps): JSX.Element => (
    post.forwarded ? (
        <Forward post={post}>
            <PostContent channel={channel} post={post} />
        </Forward>
    ) : (
        <PostContent channel={channel} post={post} />
    )
);

/**
 * Displays an individual post with its metadata and content.
 */
const Post = ({ item, channel, ...props }: PostProps & Record<string, any>): JSX.Element => {
    const { handleVisibility } = useAnalytics();

    return (
        <Group {...props} mode="plain" className="py-0">
            <div className="border-b md:border-x dark:border-[#2f3336]">
                <InView
                    className="py-2 px-2.5"
                    as="article"
                    threshold={0.3}
                    onChange={(inView, entry) => handleVisibility(entry, inView)}
                >
                    <div data-id={item.id} data-view={item.view}>
                        <PostHeader channel={channel} post={item} />
                        <Spacing />
                        <PostBody channel={channel} post={item} />
                        <Spacing />
                        <PostFooter post={item} />
                    </div>
                </InView>
            </div>
        </Group>
    );
};
Post.displayName = "Post";

/**
 * Main Posts component that renders a list of posts with pull-to-refresh and load-more functionality.
 */
export const Posts = memo(({ channel, posts, onRefresh, isFetching, isFetchingMore }: PostsProps): JSX.Element => {
    const renderItem = useCallback((item: PostInterface) => {
        return (
            <Post key={`post__item_${item.id}`} item={item} channel={channel} />
        );
    }, [channel]);

    const feedRef = useRef<HTMLDivElement>(null);

    return (
        <MediaProvider>
            <PostAiProvider>
                <SplitCol width="100%" maxWidth="600px" stretchedOnMobile autoSpaced>
                    <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
                        <div ref={feedRef} className="md:max-w-[680px] max-md:mx-0 max-lg:mx-auto w-full">
                            <div className="relative block">
                                <VirtualizedListWrapper
                                    items={posts}
                                    parentRef={feedRef}
                                    renderItem={renderItem}
                                    footer={<InfiniteFeedLoader isFetchingMore={isFetchingMore} />}
                                />
                            </div>
                        </div>
                    </PullToRefresh>
                </SplitCol>
            </PostAiProvider>
        </MediaProvider>
    );
});
Posts.displayName = "Posts";
