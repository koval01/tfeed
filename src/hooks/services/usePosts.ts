import { useState, useCallback, useEffect, useRef, SetStateAction, Dispatch } from 'react';
import { useDispatch } from 'react-redux';

import type { Post, Offset, Body } from '@/types';

// Extend the Offset type to include the latestPolledOffset property
interface ExtendedOffset extends Offset {
    latestPolledOffset?: Offset;
}

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
    }, [showErrorSnackbar, posts, isRefreshing]);

    return {
        posts,
        isFetching,
        refreshPosts,
        initializePosts,
        isRefreshing
    };
};
