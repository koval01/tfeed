import { FC, useCallback, useEffect, useState } from "react";
import { Body, Offset, Post } from "@/types";

import { onRefresh as onRefreshAction } from "./actions";
import { Panel, PanelHeader, SplitLayout } from "@vkontakte/vkui";

import {
    Posts as PostsSkeleton,
    Profile as ProfileSkeleton
} from "./Skeleton";

import { MainNav } from "@/components/main-nav";
import { Posts } from "./Posts";
import { Profile } from "./Profile";

import ErrorSnackbar from "../ErrorSnackbar";

export function Feed({ data, isLoading }: { data: Body, isLoading: boolean }) {
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

    const onRefresh = async () => await onRefreshAction(
        channelUsername, 
        offset, 
        setIsFetching, 
        setPosts, 
        setOffset, 
        showErrorSnackbar
    );

    return (
        <Panel>
            <PanelHeader before={<MainNav />}></PanelHeader>
            <SplitLayout center>
                {isLoading ? (
                    <>
                        <PostsSkeleton />
                        <ProfileSkeleton />
                    </>
                ) : (
                    <>
                        <Posts channel={data.channel} posts={posts} onRefresh={onRefresh} isFetching={isFetching} />
                        <Profile channel={data.channel} />
                        {snackbar}
                    </>
                )}
            </SplitLayout>
        </Panel>
    );
}
