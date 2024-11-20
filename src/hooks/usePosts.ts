import { useState, useCallback, MutableRefObject, Dispatch, SetStateAction } from 'react';

import { Post, Offset, Body } from '@/types';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

import { onRefresh, onMore } from '@/components/feed/actions';

interface UsePostsReturn {
    posts: Post[];
    offset: Offset;
    isFetching: boolean;
    isFetchingMore: boolean;
    noMorePosts: boolean;
    refreshPosts: (showError?: boolean) => Promise<void>;
    loadMorePosts: () => Promise<void>;
    initializePosts: (data: Body) => void;
}

export const usePosts = (
    channelUsername: string | undefined,
    showErrorSnackbar: (message: string) => void,
    refTurnstile: MutableRefObject<TurnstileInstance | null>
): UsePostsReturn => {
    // State management
    const [posts, setPosts] = useState<Post[]>([]);
    const [offset, setOffset] = useState<Offset>({});
    const [isFetching, setIsFetching] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);

    // Helper function to fetch Turnstile token
    const fetchTurnstileToken = async (): Promise<string | undefined> => {
        refTurnstile.current?.reset();
        return await refTurnstile.current?.getResponsePromise();
    };

    // Initialize posts and set offset
    const initializePosts = useCallback((data: Body) => {
        const newPosts = data?.content?.posts?.slice().reverse() || [];
        setPosts((prevPosts) => [...newPosts, ...prevPosts]);

        const offsetObject: Offset = {
            ...data?.meta?.offset,
            after: newPosts[0]?.id ?? null, // Handle cases where there are no new posts
        };
        setOffset(offsetObject);
    }, []);

    // Refresh posts from server
    const refreshPosts = useCallback(async (showError = false) => {
        try {
            const turnstileToken = await fetchTurnstileToken();
            if (!turnstileToken) throw new Error('Failed to fetch Turnstile token');

            await onRefresh(
                channelUsername,
                offset,
                turnstileToken,
                setIsFetching,
                setPosts,
                setOffset,
                showError ? showErrorSnackbar : undefined
            );
        } catch (error) {
            console.error('Error refreshing posts:', error);
            if (showError) showErrorSnackbar('Failed to refresh posts');
        }
    }, [channelUsername, offset, showErrorSnackbar]);

    // Load more posts
    const loadMorePosts = useCallback(async () => {
        if (isFetching || isFetchingMore) return;

        setIsFetchingMore(true);
        try {
            const turnstileToken = await fetchTurnstileToken();
            if (!turnstileToken) throw new Error('Failed to fetch Turnstile token');

            await onMore(
                channelUsername,
                offset,
                turnstileToken,
                setIsFetchingMore,
                setPosts,
                setOffset,
                setNoMorePosts,
                showErrorSnackbar
            );
        } catch (error) {
            console.error('Error loading more posts:', error);
            showErrorSnackbar('Failed to load more posts');
        } finally {
            setIsFetchingMore(false);
        }
    }, [channelUsername, offset, isFetching, isFetchingMore, showErrorSnackbar]);

    // Return object, alphabetized for clarity
    return {
        initializePosts,
        isFetching,
        isFetchingMore,
        loadMorePosts,
        noMorePosts,
        offset,
        posts,
        refreshPosts,
    };
};
