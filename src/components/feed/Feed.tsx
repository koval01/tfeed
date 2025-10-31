"use client";

import { type FC, useCallback, useEffect, useState } from "react";

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
import { Profile as DesktopProfile } from "@/components/feed/profile/Desktop";

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
 * The Feed component displays a feed of posts.
 *
 * @param props - Component props.
 */
export const Feed: FC<FeedProps> = ({ data, isLoading }) => {
    const [snackbar, setSnackbar] = useState<React.ReactElement | null>(null);

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

    const {
        posts,
        isFetching,
        refreshPosts,
        initializePosts,
        isRefreshing
    } = usePosts(showErrorSnackbar);

    useEffect(() => {
        if (data) {
            initializePosts(data);
        }
    }, [data, initializePosts, isLoading]);

    useInterval(() => {
        if (!isRefreshing) {
            refreshPosts(false);
        }
    }, 1e3);

    return (
        (<Panel>
            <FeedHeader isLoading={isLoading} />
            <SplitLayout center className="relative lg:right-8">
                {isLoading ? (
                    (<>
                        <PostsSkeleton />
                        <ProfileSkeleton />
                    </>)
                ) : (
                    (<>
                        <Posts
                            posts={posts}
                            onRefresh={refreshPosts}
                            isFetching={isFetching}
                        />
                        <DesktopProfile />
                    </>)
                )}
            </SplitLayout>
            {snackbar}
        </Panel>)
    );
};
