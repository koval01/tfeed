import { FC, useCallback, useEffect, useState } from "react";
import { Body, Offset, Post } from "@/types";
import { AxiosError } from "axios";

import { getMore } from "./fetcher";
import { Panel, PanelHeader, SplitLayout } from "@vkontakte/vkui";
import { Icon28CheckCircleFill, Icon28SearchStarsOutline } from "@vkontakte/icons";

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

    const onRefresh = async () => {
        if (!channelUsername || !offset.after) return;

        setIsFetching(true);

        try {
            const data = await getMore(channelUsername, offset.after, true);

            const posts = data?.posts?.slice().reverse() || [];
            setPosts((prevPosts) => [...posts, ...prevPosts]);
            setOffset((prevOffset) => ({
                ...prevOffset,
                after: data?.posts[0]?.id,
            }));

            showErrorSnackbar(
                "The feed has been updated successfully.",
                Icon28CheckCircleFill,
                null
            );
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    showErrorSnackbar(
                        "The feed has been updated, but there are no new entries yet.",
                        Icon28SearchStarsOutline,
                        "--vkui--color_icon_accent"
                    );
                } else {
                    console.error("Error refreshing data", err);
                    showErrorSnackbar(`Error refreshing data. Status: ${err.response?.statusText || err.message}`);
                }
            } else {
                console.error("Error refreshing data", err);
                showErrorSnackbar(`Error refreshing data.`);
            }
        } finally {
            setIsFetching(false);
        }
    };

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
