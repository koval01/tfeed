"use client";

import { type FC, useCallback, useEffect, useState } from "react";

import { usePosts } from "@/hooks/usePosts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import type { Body } from "@/types";

import { Panel, SplitLayout } from "@vkontakte/vkui";

import { 
    Posts as PostsSkeleton, 
    Profile as ProfileSkeleton 
} from "@/components/feed/Skeleton";

import { Posts } from "@/components/feed/Post";
import { Profile } from "@/components/feed/Profile";
import ErrorSnackbar from "@/components/ErrorSnackbar";
import { FeedHeader } from "@/components/feed/FeedHeader";

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
        (message: string, Icon?: FC, iconColor?: string) => {
            if (!snackbar) {
                setSnackbar(
                    <ErrorSnackbar
                        text={message}
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

    useEffect(() => {
        const refreshInterval = setInterval(() => refreshPosts(false), 1e4);
        return () => clearInterval(refreshInterval);
    }, [refreshPosts]);

    return (
        <Panel>
            {/* Header */}
            <FeedHeader channel={data?.channel} isLoading={isLoading} />

            {/* Main layout */}
            <SplitLayout center>
                {isLoading ? (
                    // Show skeletons during loading
                    <>
                        <PostsSkeleton />
                        <ProfileSkeleton />
                    </>
                ) : (
                    // Show posts and profile when data is ready
                    <>
                        <Posts
                            channel={data.channel}
                            posts={posts}
                            onRefresh={refreshPosts}
                            isFetching={isFetching}
                            isFetchingMore={isFetchingMore}
                        />
                        <Profile channel={data.channel} />
                    </>
                )}
            </SplitLayout>

            {/* Snackbar */}
            {snackbar}
        </Panel>
    );
};
