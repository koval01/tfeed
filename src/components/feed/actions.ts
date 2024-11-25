import { type FC, SetStateAction } from "react";
import type { Offset, Post } from "@/types";
import { AxiosError } from "axios";

import {
    Icon28CheckCircleFill,
    Icon28SearchStarsOutline,
} from "@vkontakte/icons";

import { getMore } from "@/components/feed/fetcher";

/**
 * Manages fetching, updating, and error handling for a feed of posts.
 */
class PostFetcher {
    private channelUsername?: string;
    private setPosts: (value: SetStateAction<Post[]>) => void;
    private setOffset: (value: SetStateAction<Offset>) => void;
    private showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string) => void;

    constructor(
        channelUsername: string | undefined,
        setPosts: (value: SetStateAction<Post[]>) => void,
        setOffset: (value: SetStateAction<Offset>) => void,
        showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string) => void
    ) {
        this.channelUsername = channelUsername;
        this.setPosts = setPosts;
        this.setOffset = setOffset;
        this.showErrorSnackbar = showErrorSnackbar;
    }

    /**
     * Fetches posts from the server.
     *
     * @param offsetKey - The offset value to start fetching from.
     * @param direction - The direction of pagination ("after" or "before").
     * @param setIsFetching - Function to toggle the loading state.
     */
    private async fetchPosts(
        offsetKey: number | undefined,
        direction: "after" | "before",
        setIsFetching: (value: SetStateAction<boolean>) => void
    ): Promise<Post[] | null> {
        if (!this.channelUsername || offsetKey === undefined) return null;

        setIsFetching(true);

        try {
            const response = await getMore(this.channelUsername, offsetKey, direction);
            return response?.posts?.slice().reverse() || [];
        } catch (error) {
            this.handleError(
                error,
                direction === "after" ? "refreshing data" : "fetching older posts"
            );
            return null;
        } finally {
            setIsFetching(false);
        }
    }

    /**
     * Handles errors during post fetching.
     *
     * @param error - The error object thrown.
     * @param context - The context of the error (e.g., "refreshing data").
     */
    private handleError(error: unknown, context: string): void {
        const isAxiosError = error instanceof AxiosError;
        const is404 = isAxiosError && error.response?.status === 404;

        if (!is404) {
            console.error(`Error during ${context}`, error);
        }

        const message = is404
            ? context === "refreshing data"
                ? "The feed is up to date, but there are no new entries."
                : "No more older posts are available."
            : `An error occurred while ${context}${isAxiosError ? `. Status: ${error.response?.statusText || error.message}` : "."
            }`;

        this.showErrorSnackbar?.(
            message,
            is404 ? Icon28SearchStarsOutline : undefined,
            is404 ? "--vkui--color_icon_accent" : undefined
        );
    }

    /**
     * Updates the state with new posts and adjusts the pagination offset.
     *
     * @param posts - The new posts to add.
     * @param direction - The direction of pagination ("after" or "before").
     */
    private updatePostsAndOffset(posts: Post[], direction: "after" | "before"): void {
        if (posts.length === 0) return;

        this.setPosts((prevPosts) =>
            direction === "after" ? [...posts, ...prevPosts] : [...prevPosts, ...posts]
        );

        this.setOffset((prevOffset) => ({
            ...prevOffset,
            [direction]: direction === "after"
                ? posts[0]?.id
                : posts[posts.length - 1]?.id,
        }));
    }

    /**
     * Refreshes the feed with new posts.
     *
     * @param offset - The current offset object.
     * @param setIsFetching - Function to toggle the loading state.
     */
    async refresh(
        offset: Offset,
        setIsFetching: (value: SetStateAction<boolean>) => void
    ): Promise<void> {
        const posts = await this.fetchPosts(offset.after, "after", setIsFetching);
        if (posts) {
            this.updatePostsAndOffset(posts, "after");
            this.showErrorSnackbar?.("Feed successfully updated.", Icon28CheckCircleFill);
        }
    }

    /**
     * Loads older posts and updates the state.
     *
     * @param offset - The current offset object.
     * @param setIsFetchingMore - Function to toggle the loading state.
     * @param setNoLoadMore - Function to mark no more posts available.
     */
    async loadMore(
        offset: Offset,
        setIsFetchingMore: (value: SetStateAction<boolean>) => void,
        setNoLoadMore: (state: boolean) => void
    ): Promise<void> {
        const posts = await this.fetchPosts(offset.before, "before", setIsFetchingMore);

        if (posts && posts.length > 0) {
            this.updatePostsAndOffset(posts, "before");
        } else if (posts === null) {
            setNoLoadMore(true);
            this.showErrorSnackbar?.(
                "No more posts available.",
                Icon28SearchStarsOutline,
                "--vkui--color_icon_accent"
            );
        }
    }
}

/**
 * Handles refreshing the feed.
 */
export const onRefresh = async (
    channelUsername: string | undefined,
    offset: Offset,
    setIsFetching: (value: SetStateAction<boolean>) => void,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void,
    showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string) => void
): Promise<void> => {
    const postFetcher = new PostFetcher(channelUsername, setPosts, setOffset, showErrorSnackbar);
    await postFetcher.refresh(offset, setIsFetching);
};

/**
 * Handles loading more posts.
 */
export const onMore = async (
    channelUsername: string | undefined,
    offset: Offset,
    setIsFetchingMore: (value: SetStateAction<boolean>) => void,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void,
    setNoLoadMore: (state: boolean) => void,
    showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string) => void
): Promise<void> => {
    const postFetcher = new PostFetcher(channelUsername, setPosts, setOffset, showErrorSnackbar);
    await postFetcher.loadMore(offset, setIsFetchingMore, setNoLoadMore);
};
