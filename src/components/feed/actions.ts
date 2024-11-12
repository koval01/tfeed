import { Icon28CheckCircleFill, Icon28SearchStarsOutline } from '@vkontakte/icons';

import { Offset, Post } from "@/types";
import { AxiosError } from 'axios';
import { getMore } from './fetcher';
import { FC, SetStateAction } from 'react';

export const onRefresh = async (
    channelUsername: string | undefined,
    offset: Offset,
    setIsFetching: (value: SetStateAction<boolean>) => void,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void,
    showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string | null) => void
) => {
    if (!channelUsername || !offset.after) return;
    setIsFetching(true);

    try {
        const data = await getMore(channelUsername, offset.after, true);
        const posts = data?.posts?.slice().reverse() || [];

        setPosts(prevPosts => [...posts, ...prevPosts]);
        setOffset(prevOffset => ({ ...prevOffset, after: data?.posts[0]?.id }));

        showErrorSnackbar?.("The feed has been updated successfully.", Icon28CheckCircleFill, null);
    } catch (err) {
        const is404 = err instanceof AxiosError && err.response?.status === 404;
        if (!is404) console.error("Error refreshing data", err);
        
        showErrorSnackbar?.(
            is404
                ? "The feed has been updated, but there are no new entries yet."
                : `Error refreshing data${err instanceof AxiosError ? `. Status: ${err.response?.statusText || err.message}` : '.'}`,
            is404 ? Icon28SearchStarsOutline : undefined,
            is404 ? "--vkui--color_icon_accent" : null
        );
    } finally {
        setIsFetching(false);
    }
};
