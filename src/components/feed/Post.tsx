"use client";

import React, { useCallback } from "react";
import { useSelector } from "react-redux";

import { selectNoLoadMore } from '@/lib/store';

import type {
    PostBodyProps,
    PostsProps,
    PostProps,
    LoadingMoreProps
} from "@/types/feed/post";

import type { 
    Post as PostInterface 
} from "@/types";

import VirtualizedListWrapper from "@/components/VirtualizedListWrapper";

import {
    Group,
    SplitCol,
    Spacing,
    PullToRefresh,
    Subhead
} from "@vkontakte/vkui";

import {
    PostContent,
    PostFooter,
    PostHeader
} from "@/components/feed/Body";

import { InView } from "react-intersection-observer";
import { useAnalytics } from "@/hooks/useAnalytics";

import { Forward } from "@/components/feed/Forward";
import { Button } from "@/components/Button";
import { ThreeDot } from "react-loading-indicators";

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
 * Button for loading more posts, with a loader when fetching.
 */
const LoadingMoreButton = ({ isFetchingMore }: { isFetchingMore: boolean }): JSX.Element => (
    <div className="flex justify-center">
        <Button
            size="s"
            appearance="neutral"
            loading={isFetchingMore}
            loader={<ThreeDot variant="pulsate" color="#818c99" style={{ fontSize: "4px" }} />}
            disabled={isFetchingMore}
            className="w-24 h-[30px]"
        >
            <Subhead weight="1" className="text-xs vkuiPlaceholder__text">Load more</Subhead>
        </Button>
    </div>
);

/**
 * Displays the loading state or button to load more posts.
 */
const LoadingMore = ({ isFetchingMore }: LoadingMoreProps): JSX.Element => {
    const noMorePosts = useSelector(selectNoLoadMore);

    return (
        <Group mode="plain" className="my-0.5 md:my-1 lg:my-1.5 pb-12 md:pb-24">
            {!noMorePosts && <LoadingMoreButton isFetchingMore={isFetchingMore} />}
        </Group>
    )
};

/**
 * Displays an individual post with its metadata and content.
 */
const Post = React.memo(({ item, channel, ...props }: PostProps & Record<string, any>): JSX.Element => {
    const { handleVisibility } = useAnalytics();

    return (
        <Group {...props}>
            <InView
                className="py-2.5 px-4"
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
        </Group>
    );
});

Post.displayName = "Post";

/**
 * Main Posts component that renders a list of posts with pull-to-refresh and load-more functionality.
 */
export const Posts = ({ channel, posts, onRefresh, isFetching, isFetchingMore }: PostsProps): JSX.Element => {
    const renderItem = useCallback((item: PostInterface) => {
        return (
            <Post key={item.id} item={item} channel={channel} />
        );
    }, [channel]);

    return (
        <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
            <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
                <div className="md:max-w-[680px] max-md:mx-0 max-lg:mx-auto w-full">
                    <VirtualizedListWrapper 
                        items={posts} 
                        renderItem={renderItem} 
                        loadMoreButton={<LoadingMore isFetchingMore={isFetchingMore} />} 
                    />
                </div>
            </PullToRefresh>
        </SplitCol>
    );
}
