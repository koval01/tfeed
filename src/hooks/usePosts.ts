import { useState, useCallback } from 'react';
import { Post, Offset, Body } from '@/types';
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
    showErrorSnackbar: (message: string) => void
): UsePostsReturn => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [offset, setOffset] = useState<Offset>({});
    const [isFetching, setIsFetching] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);

    const initializePosts = useCallback((data: Body) => {
        const newPosts = data?.content?.posts?.slice().reverse() || [];
        setPosts((prevPosts) => [...newPosts, ...prevPosts]);

        const offsetObject = {
            ...data?.meta?.offset,
            after: newPosts[0]?.id
        };
        setOffset(offsetObject);
    }, []);

    const refreshPosts = useCallback(async (showError = true) => {
        await onRefresh(
            channelUsername,
            offset,
            setIsFetching,
            setPosts,
            setOffset,
            showError ? showErrorSnackbar : undefined
        );
    }, [channelUsername, offset, showErrorSnackbar]);

    const loadMorePosts = useCallback(async () => {
        if (isFetchingMore || isFetching) return;

        await onMore(
            channelUsername,
            offset,
            setIsFetchingMore,
            setPosts,
            setOffset,
            setNoMorePosts,
            showErrorSnackbar
        );
    }, [channelUsername, offset, isFetching, isFetchingMore, showErrorSnackbar]);

    return {
        posts,
        offset,
        isFetching,
        isFetchingMore,
        noMorePosts,
        refreshPosts,
        loadMorePosts,
        initializePosts
    };
};
