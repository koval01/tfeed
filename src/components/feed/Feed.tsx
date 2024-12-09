"use client";

import { type FC, useCallback, useEffect, useState } from "react";

import { useInfiniteScroll } from "@/hooks/services/useInfiniteScroll";
import { usePosts } from "@/hooks/services/usePosts";
import { useInterval } from "@/hooks/utils/useInterval";

import type { Body } from "@/types";

import { Panel, SplitLayout } from "@vkontakte/vkui";

import {
    Posts as PostsSkeleton,
    Profile as ProfileSkeleton
} from "@/components/feed/Skeleton";

import ErrorSnackbar from "@/components/error/ErrorSnackbar";
import { FeedHeader } from "@/components/feed/header/FeedHeader";
import { Posts } from "@/components/feed/post/Post";
import { Profile } from "@/components/feed/profile/Profile";

interface FeedProps {
    /**
     * The initial data to populate the feed.
     */
    data: Body;

    /**
     * Flag to indicate whether the initial data is being loaded.
     */
    isLoading: boolean;
}

/**
 * The Feed component displays a feed of posts with infinite scroll and error handling.
 *
 * @param props - Component props.
 */
export const Feed: FC<FeedProps> = ({ data, isLoading }) => {
    const [channelUsername, setChannelUsername] = useState<string | undefined>(undefined);
    const [snackbar, setSnackbar] = useState<React.ReactElement | null>(null);

    // Function to show error notifications
    const showErrorSnackbar = useCallback(
        (message: string, subtext?: string, Icon?: FC, iconColor?: string) => {
            if (!snackbar) {
                setSnackbar(
                    <ErrorSnackbar
                        text={message}
                        subtext={subtext}
                        onClose={() => setSnackbar(null)}
                        Icon={Icon}
                        iconColor={iconColor}
                    />
                );
            }
        },
        [snackbar]
    );

    // Custom hook to manage posts
    const {
        posts,
        isFetching,
        isFetchingMore,
        refreshPosts,
        loadMorePosts,
        initializePosts,
    } = usePosts(channelUsername, showErrorSnackbar);

    // Infinite scroll setup
    useInfiniteScroll({
        onLoadMore: loadMorePosts,
        isLoading: isFetchingMore,
    });

    // Initialize posts and set the channel username on data change
    useEffect(() => {
        if (data) {
            initializePosts(data);
            setChannelUsername(data.channel?.username);
        }
    }, [data, initializePosts]);

    useInterval(() => refreshPosts(false), 3e3);

    return (
        (<Panel>
            {/* Header */}
            <FeedHeader channel={data?.channel} isLoading={isLoading} />
            {/* Main layout */}
            <SplitLayout center>
                {isLoading ? (
                    // Show skeletons during loading
                    (<>
                        <PostsSkeleton />
                        <ProfileSkeleton />
                    </>)
                ) : (
                    // Show posts and profile when data is ready
                    (<>
                        <Posts
                            channel={data.channel}
                            posts={posts}
                            onRefresh={refreshPosts}
                            isFetching={isFetching}
                            isFetchingMore={isFetchingMore}
                        />
                        <Profile channel={data.channel} />
                    </>)
                )}
            </SplitLayout>
            {/* Snackbar */}
            {snackbar}
        </Panel>)
    );
};
