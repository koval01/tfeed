import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Body } from "@/types";
import type { TurnstileInstance } from '@marsidev/react-turnstile';

import { Panel, SplitLayout } from "@vkontakte/vkui";

import { Posts } from "@/components/feed/Post";
import { Profile } from "@/components/feed/Profile";

import {
    Posts as PostsSkeleton,
    Profile as ProfileSkeleton
} from "@/components/feed/Skeleton";

import { FeedHeader } from "@/components/feed/FeedHeader";
import ErrorSnackbar from "@/components/ErrorSnackbar";
import { Turnstile } from '@marsidev/react-turnstile';

import { usePosts } from "@/hooks/usePosts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface FeedProps {
    data: Body;
    isLoading: boolean;
}

export const Feed: FC<FeedProps> = ({ data, isLoading }) => {
    const refTurnstile = useRef<TurnstileInstance | null>(null);
    const [channelUsername, setChannelUsername] = useState<string>();
    const [snackbar, setSnackbar] = useState<React.ReactElement | null>(null);

    const showErrorSnackbar = useCallback((message: string, Icon?: FC, iconColor?: string | null) => {
        if (!snackbar)
            setSnackbar(<ErrorSnackbar
                text={message}
                onClose={() => setSnackbar(null)}
                Icon={Icon ?? Icon}
                iconColor={iconColor ?? iconColor}
            />);
    }, [snackbar]);

    const {
        posts,
        isFetching,
        isFetchingMore,
        noMorePosts,
        refreshPosts,
        loadMorePosts,
        initializePosts
    } = usePosts(channelUsername, showErrorSnackbar, refTurnstile);

    useInfiniteScroll({
        onLoadMore: loadMorePosts,
        isLoading: isFetchingMore,
        noMoreItems: noMorePosts
    });

    useEffect(() => {
        initializePosts(data);
        setChannelUsername(data?.channel?.username);
    }, [data, initializePosts]);

    useEffect(() => {
        const intervalId = setInterval(() => refreshPosts(), 1e5);
        return () => clearInterval(intervalId);
    }, [refreshPosts]);

    useEffect(() => {
        refTurnstile.current?.render();
        return () => refTurnstile.current?.remove();
    }, [refTurnstile]);

    return (
        <Panel>
            <FeedHeader channel={data?.channel} isLoading={isLoading} />
            <SplitLayout center>
                {isLoading ? (
                    <>
                        <PostsSkeleton />
                        <ProfileSkeleton />
                    </>
                ) : (
                    <>
                        <Posts
                            channel={data.channel}
                            posts={posts}
                            onRefresh={() => refreshPosts(true)}
                            isFetching={isFetching}
                            isFetchingMore={isFetchingMore}
                            noMorePosts={noMorePosts}
                        />
                        <Profile channel={data.channel} />
                        {snackbar}
                    </>
                )}
                <Turnstile ref={refTurnstile} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_KEY as string} />
            </SplitLayout>
        </Panel>
    );
};
