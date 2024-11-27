import { type FC, SetStateAction } from "react";
import type { Offset, Post } from "@/types";
import { AxiosError } from "axios";
import {
    Icon28CheckCircleFill,
    Icon28SearchStarsOutline,
} from "@vkontakte/icons";

import { getMore } from "@/components/feed/fetcher";

type Direction = "before" | "after";

interface ErrorHandlerOptions {
    context: string;
    showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string) => void;
}

interface FetcherConfig {
    channelUsername?: string;
    setPosts: (value: SetStateAction<Post[]>) => void;
    setOffset: (value: SetStateAction<Offset>) => void;
    showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string) => void;
}

/**
 * Handles error scenarios during post fetching operations
 */
const handleFetchError = (error: unknown, { context, showErrorSnackbar }: ErrorHandlerOptions): boolean => {
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

    showErrorSnackbar?.(
        message,
        is404 ? Icon28SearchStarsOutline : undefined,
        is404 ? "--vkui--color_icon_accent" : undefined
    );

    return is404;
};

/**
 * Updates posts and offset state based on fetch results
 */
const updatePostsAndOffset = (
    posts: Post[],
    direction: Direction,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void
): void => {
    if (posts.length === 0) return;

    setPosts((prevPosts) =>
        direction === "after" ? [...posts, ...prevPosts] : [...prevPosts, ...posts]
    );

    setOffset((prevOffset) => ({
        ...prevOffset,
        [direction]: direction === "after"
            ? posts[0]?.id
            : posts[posts.length - 1]?.id,
    }));
};

/**
 * Fetches posts from the server with error handling
 */
const fetchPosts = async (
    config: FetcherConfig,
    offsetKey: number | undefined,
    direction: Direction,
    setIsFetching: (value: SetStateAction<boolean>) => void
): Promise<Post[] | null> => {
    const { channelUsername, showErrorSnackbar } = config;

    if (!channelUsername || offsetKey === undefined) return null;

    setIsFetching(true);

    try {
        const response = await getMore(channelUsername, offsetKey, direction);
        return response?.posts?.slice().reverse() || [];
    } catch (error) {
        const is404 = handleFetchError(error, {
            context: direction === "after" ? "refreshing data" : "fetching older posts",
            showErrorSnackbar
        });
        return is404 ? [] : null;
    } finally {
        setIsFetching(false);
    }
};

/**
 * Refreshes the feed with new posts
 */
export const onRefresh = async (
    channelUsername: string | undefined,
    offset: Offset,
    setIsFetching: (value: SetStateAction<boolean>) => void,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void,
    showErrorSnackbar?: (message: string, Icon?: FC, iconColor?: string) => void
): Promise<void> => {
    const config: FetcherConfig = {
        channelUsername,
        setPosts,
        setOffset,
        showErrorSnackbar
    };

    const posts = await fetchPosts(config, offset.after, "after", setIsFetching);

    if (posts) {
        updatePostsAndOffset(posts, "after", setPosts, setOffset);
        showErrorSnackbar?.("Feed successfully updated.", Icon28CheckCircleFill);
    }
};

/**
 * Loads more posts and handles pagination
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
    const config: FetcherConfig = {
        channelUsername,
        setPosts,
        setOffset,
        showErrorSnackbar
    };

    const posts = await fetchPosts(config, offset.before, "before", setIsFetchingMore);

    if (posts && posts.length > 0) {
        updatePostsAndOffset(posts, "before", setPosts, setOffset);
    } else if (posts && posts.length === 0) {
        setNoLoadMore(true);
        showErrorSnackbar?.(
            "No more posts available.",
            Icon28SearchStarsOutline,
            "--vkui--color_icon_accent"
        );
    }
};
