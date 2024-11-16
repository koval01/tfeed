import { FC, useCallback, useEffect, useState } from "react";
import { Body, Offset, Post } from "@/types";

import { onRefresh as onRefreshAction } from "@/components/feed/actions";
import { Panel, PanelHeader, SplitLayout } from "@vkontakte/vkui";

import {
    ChannelNavSkeleton,
    Posts as PostsSkeleton,
    Profile as ProfileSkeleton
} from "@/components/feed/Skeleton";

import { ChannelNav, SubscribeButton } from "@/components/feed/Nav";
import { Posts } from "@/components/feed/Post";
import { Profile } from "@/components/feed/Profile";

import ErrorSnackbar from "@/components/ErrorSnackbar";

export const Feed = ({ data, isLoading }: { data: Body, isLoading: boolean }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [offset, setOffset] = useState<Offset>({});
    const [channelUsername, setChannelUsername] = useState<string>();

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<React.JSX.Element | null>(null);

    const showErrorSnackbar = useCallback((message: string, Icon?: FC, iconColor?: string | null) => {
        if (!snackbar)
            setSnackbar(<ErrorSnackbar
                text={message}
                onClose={() => setSnackbar(null)}
                Icon={Icon ?? Icon}
                iconColor={iconColor ?? iconColor}
            />);
    }, [snackbar]);

    useEffect(() => {
        const posts = data?.content?.posts?.slice().reverse() || [];
        setPosts((prevPosts) => [...posts, ...prevPosts]);

        const offsetObject = Object.assign({}, data?.meta?.offset, { after: posts[0]?.id });
        setOffset(offsetObject || {});

        setChannelUsername(data?.channel?.username);
    }, [data]);

    const refreshPosts = useCallback(async (showError = false) => {
        await onRefreshAction(
            channelUsername,
            offset,
            setIsFetching,
            setPosts,
            setOffset,
            showError ? showErrorSnackbar : void 0
        );
    }, [channelUsername, offset, showErrorSnackbar]);

    useEffect(() => {
        const backgroundRefresh = async () => {
            await refreshPosts();
        };

        const intervalId = setInterval(backgroundRefresh, 1e4);
        return () => clearInterval(intervalId);
    }, [refreshPosts]);

    return (
        <Panel>
            <PanelHeader
                before={
                    isLoading ? <ChannelNavSkeleton /> : <ChannelNav channel={data.channel} />
                }
                after={
                    <div className="inline-block items-center overflow-hidden lg:hidden">
                        <SubscribeButton channel={data?.channel} />
                    </div>
                }
            />
            <SplitLayout center>
                {isLoading ? (
                    <>
                        <PostsSkeleton />
                        <ProfileSkeleton />
                    </>
                ) : (
                    <>
                        <Posts channel={data.channel} posts={posts} onRefresh={() => refreshPosts(true)} isFetching={isFetching} />
                        <Profile channel={data.channel} />
                        {snackbar}
                    </>
                )}
            </SplitLayout>
        </Panel>
    );
}
