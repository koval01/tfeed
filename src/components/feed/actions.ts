import { Icon28CheckCircleFill, Icon28SearchStarsOutline } from '@vkontakte/icons';
import { Offset, Post } from "@/types";
import { AxiosError } from 'axios';
import { getMore } from './fetcher';
import { FC, SetStateAction } from 'react';

class PostFetcher {
    private channelUsername: string | undefined;
    private setPosts: (value: SetStateAction<Post[]>) => void;
    private setOffset: (value: SetStateAction<Offset>) => void;
    private showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string | null) => void;

    constructor(
        channelUsername: string | undefined,
        setPosts: (value: SetStateAction<Post[]>) => void,
        setOffset: (value: SetStateAction<Offset>) => void,
        showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string | null) => void
    ) {
        this.channelUsername = channelUsername;
        this.setPosts = setPosts;
        this.setOffset = setOffset;
        this.showErrorSnackbar = showErrorSnackbar;
    }

    private async fetchPosts(offsetKey: number | undefined, direction: "after" | "before", setIsFetching: (value: SetStateAction<boolean>) => void) {
        if (!this.channelUsername || !offsetKey) return;

        setIsFetching(true);

        try {
            const data = await getMore(this.channelUsername, offsetKey, direction);
            const posts = data?.posts?.slice().reverse() || [];

            return posts;
        } catch (err) {
            this.handleError(err, direction === "after" ? "refreshing data" : "fetching older posts");
            return null;
        } finally {
            setIsFetching(false);
        }
    }

    private handleError(err: unknown, context: string) {
        const is404 = err instanceof AxiosError && err.response?.status === 404;
        if (!is404) console.error(`Error ${context}`, err);

        const message = is404
            ? (context === "refreshing data"
                ? "The feed has been updated, but there are no new entries yet."
                : "No more older posts available.")
            : `Error ${context}${err instanceof AxiosError ? `. Status: ${err.response?.statusText || err.message}` : '.'}`;

        this.showErrorSnackbar?.(
            message,
            is404 ? Icon28SearchStarsOutline : undefined,
            is404 ? "--vkui--color_icon_accent" : undefined
        );
    }

    private updatePostsAndOffset(posts: Post[], direction: "after" | "before") {
        if (posts.length === 0) return;

        this.setPosts(prevPosts => {
            return direction === "after"
                ? [...posts, ...prevPosts]
                : [...prevPosts, ...posts];
        });

        this.setOffset(prevOffset => ({
            ...prevOffset,
            [direction]: direction === "after" ? posts[0]?.id : posts[posts.length - 1]?.id,
        }));
    }

    async refresh(offset: Offset, setIsFetching: (value: SetStateAction<boolean>) => void) {
        const posts = await this.fetchPosts(offset.after, "after", setIsFetching);
        if (posts) {
            this.updatePostsAndOffset(posts, "after");
            this.showErrorSnackbar?.("The feed has been updated successfully.", Icon28CheckCircleFill);
        }
    }

    async loadMore(
        offset: Offset,
        setIsFetchingMore: (value: SetStateAction<boolean>) => void,
        setNoMorePosts: (value: SetStateAction<boolean>) => void
    ) {
        const posts = await this.fetchPosts(offset.before, "before", setIsFetchingMore);
        if (posts && posts.length > 0) {
            this.updatePostsAndOffset(posts, "before");
        } else {
            setNoMorePosts(true);
            this.showErrorSnackbar?.("No more posts available.", Icon28SearchStarsOutline, "--vkui--color_icon_accent");
        }
    }
}

export const onRefresh = async (
    channelUsername: string | undefined,
    offset: Offset,
    setIsFetching: (value: SetStateAction<boolean>) => void,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void,
    showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string | null) => void
) => {
    const postFetcher = new PostFetcher(channelUsername, setPosts, setOffset, showErrorSnackbar);
    await postFetcher.refresh(offset, setIsFetching);
};

export const onMore = async (
    channelUsername: string | undefined,
    offset: Offset,
    setIsFetchingMore: (value: SetStateAction<boolean>) => void,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void,
    setNoMorePosts: (value: SetStateAction<boolean>) => void,
    showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string | null) => void
) => {
    const postFetcher = new PostFetcher(channelUsername, setPosts, setOffset, showErrorSnackbar);
    await postFetcher.loadMore(offset, setIsFetchingMore, setNoMorePosts);
};
