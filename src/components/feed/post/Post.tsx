"use client";

import { type JSX, useCallback } from "react";

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

import { Forward } from "@/components/feed/post/Forward";
import { Header } from "@/components/feed/post/Header";

import { MediaProvider } from "@/contexts/MediaContext";
import { EndOfContent } from "@/components/feed/post/Footer";

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
    return (
        <Group {...props} mode="plain" className="py-0">
            <div className="border-b md:border-x dark:border-[#2f3336]">
                <div className="py-2 px-2.5">
                    <div data-id={item.id} data-view={item.view}>
                        <PostHeader channel={channel} post={item} />
                        <Spacing />
                        <PostBody channel={channel} post={item} />
                        <Spacing />
                        <PostFooter post={item} />
                    </div>
                </div>
            </div>
        </Group>
    );
};

/**
 * Main Posts component that renders a list of posts with pull-to-refresh.
 */
export const Posts = ({ posts, onRefresh, isFetching }: PostsProps): JSX.Element => {
    const renderItem = useCallback((item: PostInterface) => {
        return (
            <Post key={`post__item_${item.id}`} item={item} channel={item.channel} />
        );
    }, []);

    return (
        <MediaProvider>
            <SplitCol width="100%" maxWidth="600px" stretchedOnMobile autoSpaced>
                <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
                    <div className="md:max-w-[680px] max-md:mx-0 max-lg:mx-auto w-full">
                        <div className="relative block">
                            <VirtualizedListWrapper
                                items={posts}
                                renderItem={renderItem}
                                header={<Header />}
                                footer={<EndOfContent />}
                            />
                        </div>
                    </div>
                </PullToRefresh>
            </SplitCol>
        </MediaProvider>
    );
};
