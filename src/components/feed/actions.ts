import { type FC, SetStateAction } from "react";
import type { Offset, Post, Meta } from "@/types";
import { AxiosError } from "axios";

import {
    Icon28CheckCircleFill,
    Icon28SearchStarsOutline,
} from "@vkontakte/icons";

import { apiClient } from "@/components/feed/fetcher";
import { t } from "i18next";

type FetchDirection = "before" | "after";

interface ErrorContext {
    operation: "refresh" | "load-more";
    direction: FetchDirection;
}

interface PostFetcherDependencies {
    setPosts: (value: SetStateAction<Post[]>) => void;
    setOffset: (value: SetStateAction<Offset>) => void;
    showErrorSnackbar?: SnackbarHandler;
}

interface FetchMoreResponse {
    posts: Post[];
    meta: Meta;
}

type SnackbarHandler = (
    message: string,
    subtext?: string,
    Icon?: FC,
    iconColor?: string
) => void;

class PostFetcherError extends Error {
    constructor(
        message: string,
        public readonly context: ErrorContext,
        public readonly originalError?: unknown
    ) {
        super(message);
        this.name = "PostFetcherError";
    }
}

class PostFetcher {
    private constructor(private readonly dependencies: PostFetcherDependencies) { }

    static create(dependencies: PostFetcherDependencies): PostFetcher {
        return new PostFetcher(dependencies);
    }

    private async handleApiRequest<T>(
        operation: () => Promise<T>,
        context: ErrorContext
    ): Promise<T | null> {
        try {
            return await operation();
        } catch (error) {
            this.handleError(error, context);
            return null;
        }
    }

    private handleError(error: unknown, context: ErrorContext): void {
        const isAxiosError = error instanceof AxiosError;
        const is404 = isAxiosError && error.response?.status === 404;

        if (!is404) {
            console.error(
                `Error during ${context.operation} (${context.direction})`,
                error
            );
        }

        const messageKey = is404
            ? context.operation === "refresh"
                ? "noFreshPosts"
                : "noMorePosts"
            : "errorUpdate";

        this.dependencies.showErrorSnackbar?.(
            t(messageKey, { context: context.operation }),
            isAxiosError ? error.response?.statusText || error.message : undefined,
            is404 ? Icon28SearchStarsOutline : undefined,
            is404 ? "--vkui--color_icon_accent" : undefined
        );

        if (!is404) {
            throw new PostFetcherError(
                `Failed to ${context.operation} posts`,
                context,
                error
            );
        }
    }

    private updateState(posts: Post[], direction: FetchDirection): void {
        if (posts.length === 0) return;

        this.dependencies.setPosts(prevPosts =>
            direction === "after"
                ? [...posts, ...prevPosts]
                : [...prevPosts, ...posts]
        );

        this.dependencies.setOffset(prevOffset => ({
            ...prevOffset,
            [direction]: this.getOffsetKey(posts, direction),
        }));
    }

    private getOffsetKey(posts: Post[], direction: FetchDirection): number | undefined {
        const post = direction === "after" ? posts[0] : posts[posts.length - 1];
        return post?.id;
    }

    private async fetchPosts(
        channelUsername: string,
        offsetKey: number | undefined,
        direction: FetchDirection,
        setIsLoading: (value: SetStateAction<boolean>) => void
    ): Promise<Post[] | null> {
        if (offsetKey === undefined) return null;

        setIsLoading(true);
        try {
            const response = await this.handleApiRequest<FetchMoreResponse>(
                () => apiClient.getMore(channelUsername, offsetKey, direction),
                {
                    operation: direction === "after" ? "refresh" : "load-more",
                    direction,
                }
            );

            return response?.posts?.slice().reverse() ?? null;
        } finally {
            setIsLoading(false);
        }
    }

    async refresh(
        channelUsername: string,
        offset: Offset,
        setIsFetching: (value: SetStateAction<boolean>) => void
    ): Promise<void> {
        const posts = await this.fetchPosts(
            channelUsername,
            offset.after,
            "after",
            setIsFetching
        );

        if (posts?.length) {
            this.updateState(posts, "after");
            this.dependencies.showErrorSnackbar?.(
                t("feedUpdated"),
                "",
                Icon28CheckCircleFill
            );
        }
    }

    async loadMore(
        channelUsername: string,
        offset: Offset,
        setIsFetchingMore: (value: SetStateAction<boolean>) => void,
        setNoLoadMore: (state: boolean) => void
    ): Promise<void> {
        const posts = await this.fetchPosts(
            channelUsername,
            offset.before,
            "before",
            setIsFetchingMore
        );

        if (!posts) return;

        if (posts.length > 0) {
            this.updateState(posts, "before");
        } else {
            setNoLoadMore(true);
        }
    }
}

export const createPostFetcher = (dependencies: PostFetcherDependencies) => {
    return PostFetcher.create(dependencies);
};

export const onRefresh = (
    channelUsername: string,
    offset: Offset,
    setIsFetching: (value: SetStateAction<boolean>) => void,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void,
    showErrorSnackbar?: SnackbarHandler
): Promise<void> => {
    const fetcher = createPostFetcher({
        setPosts,
        setOffset,
        showErrorSnackbar,
    });

    return fetcher.refresh(channelUsername, offset, setIsFetching);
};

export const onMore = (
    channelUsername: string,
    offset: Offset,
    setIsFetchingMore: (value: SetStateAction<boolean>) => void,
    setPosts: (value: SetStateAction<Post[]>) => void,
    setOffset: (value: SetStateAction<Offset>) => void,
    setNoLoadMore: (state: boolean) => void,
    showErrorSnackbar?: SnackbarHandler
): Promise<void> => {
    const fetcher = createPostFetcher({
        setPosts,
        setOffset,
        showErrorSnackbar,
    });

    return fetcher.loadMore(
        channelUsername,
        offset,
        setIsFetchingMore,
        setNoLoadMore
    );
};
