import { useState, useCallback } from 'react';

import type { Post, Body } from '@/types';

interface UsePostsReturn {
    posts: Post[];
    isFetching: boolean;
    refreshPosts: (showError?: boolean) => Promise<void>;
    initializePosts: (data: Body) => void;
    isRefreshing: boolean;
}

export const usePosts = (
    showErrorSnackbar: (message: string, subtext?: string) => void
): UsePostsReturn => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const initializePosts = useCallback((data: Body) => {
        const newPosts = data?.result?.slice() || [];
        setPosts((prevPosts) => [...newPosts, ...prevPosts]);
    }, []);

    const refreshPosts = useCallback(async () => {
        if (isRefreshing) return;
    }, [isRefreshing]);

    return {
        posts,
        isFetching,
        refreshPosts,
        initializePosts,
        isRefreshing
    };
};
