import { useState, useCallback, useEffect, useRef, SetStateAction, Dispatch } from 'react';
import { useDispatch } from 'react-redux';

import type { Post, Offset, Body } from '@/types';

import { setNoLoadMore as reduxSetNoLoadMore } from '@/store/postsSlice';
import { onRefresh, onMore } from '@/components/feed/actions';
import { resetNewPostsCount, addNewPostsCount } from '@/store/alertSlice';

// Extend the Offset type to include the latestPolledOffset property
interface ExtendedOffset extends Offset {
    latestPolledOffset?: Offset;
}

interface UsePostsReturn {
    posts: Post[];
    offset: ExtendedOffset;
    isFetching: boolean;
    isFetchingMore: boolean;
    setNoLoadMore: (state: boolean) => void;
    refreshPosts: (showError?: boolean) => Promise<void>;
    loadMorePosts: () => Promise<void>;
    initializePosts: (data: Body) => void;
    newPostCount: number;
    showNewPosts: () => void;
    hasNewPosts: boolean;
}

export const usePosts = (
    channelUsername: string | undefined,
    showErrorSnackbar: (message: string, subtext?: string) => void,
    pollingInterval = 1e4 // 10 seconds
): UsePostsReturn => {
    const dispatch = useDispatch();

    const setNoLoadMore = useCallback((state: boolean) => {
        dispatch(reduxSetNoLoadMore(state));
    }, [dispatch]);

    const [posts, setPosts] = useState<Post[]>([]);
    const [cachedPosts, setCachedPosts] = useState<Post[]>([]);
    const [offset, setOffset] = useState<ExtendedOffset>({});
    const [isFetching, setIsFetching] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [hasNewPosts, setHasNewPosts] = useState(false);

    const latestPollingOffset = useRef<Offset | null>(null);
    const shouldApplyCachedPosts = useRef(false);

    const applyCachedPosts = useCallback(() => {
        if (cachedPosts.length === 0) return;

        setPosts(prevPosts => [...cachedPosts, ...prevPosts]);

        if (offset.latestPolledOffset) {
            const updatedOffset = { ...offset.latestPolledOffset };
            setOffset(updatedOffset);
            // Update latestPollingOffset.current to match the applied offset
            latestPollingOffset.current = updatedOffset;
        }

        setCachedPosts([]);
        setHasNewPosts(false);
        dispatch(resetNewPostsCount());
    }, [cachedPosts, offset.latestPolledOffset, dispatch]);

    const initializePosts = useCallback((data: Body) => {
        const newPosts = data?.content?.posts?.slice().reverse() || [];
        setPosts((prevPosts) => [...newPosts, ...prevPosts]);

        const offsetObject = {
            ...data?.meta?.offset,
            after: newPosts[0]?.id
        };
        setOffset(offsetObject);
        latestPollingOffset.current = offsetObject;
    }, []);

    const pollForNewPosts = useCallback(async () => {
        if (!channelUsername || isPolling) return;

        try {
            setIsPolling(true);

            const tempPosts: Post[] = [];
            const setPollPosts: Dispatch<SetStateAction<Post[]>> = (action) => {
                const newPosts = typeof action === 'function'
                    ? action(tempPosts)
                    : action;
                tempPosts.push(...newPosts);
                return;
            };

            let tempOffset: ExtendedOffset = {};
            const setPollOffset: Dispatch<SetStateAction<ExtendedOffset>> = (action) => {
                tempOffset = typeof action === 'function'
                    ? action(tempOffset)
                    : action;
                return;
            };

            const currentPollOffset = latestPollingOffset.current || offset;

            const response = await onRefresh(
                channelUsername,
                currentPollOffset,
                () => { },
                setPollPosts,
                setPollOffset,
                undefined
            );

            if (tempPosts.length > 0) {
                // Ensure we're not adding duplicates to cachedPosts
                const existingPostIds = new Set([...cachedPosts, ...posts].map(post => post.id));
                const uniqueNewPosts = tempPosts.filter(post => !existingPostIds.has(post.id));

                if (uniqueNewPosts.length > 0) {
                    setCachedPosts(prev => [...uniqueNewPosts, ...prev]);

                    // Update the latest polling offset with the correct "after" value
                    const updatedOffset = {
                        ...tempOffset,
                        after: uniqueNewPosts[0]?.id || tempOffset.after
                    };

                    latestPollingOffset.current = updatedOffset;
                    setOffset(prevOffset => ({
                        ...prevOffset,
                        latestPolledOffset: updatedOffset
                    }));

                    setHasNewPosts(true);
                    dispatch(addNewPostsCount(uniqueNewPosts.length));
                }
            }

            return response;
        } catch (error) {
            console.error('Error polling for new posts:', error);
        } finally {
            setIsPolling(false);
        }
    }, [channelUsername, offset, isPolling, dispatch, cachedPosts, posts]);

    useEffect(() => {
        if (!channelUsername) return;

        const pollInterval = setInterval(() => {
            pollForNewPosts();
        }, pollingInterval);

        return () => clearInterval(pollInterval);
    }, [channelUsername, pollingInterval, pollForNewPosts]);

    useEffect(() => {
        const checkScrollPosition = () => {
            if (cachedPosts.length === 0) return;
            if (document.documentElement.scrollTop === 0) {
                shouldApplyCachedPosts.current = true;
            }
        };

        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    checkScrollPosition();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [cachedPosts.length]);

    useEffect(() => {
        if (shouldApplyCachedPosts.current && cachedPosts.length > 0) {
            applyCachedPosts();
            shouldApplyCachedPosts.current = false;
        }
    }, [cachedPosts, applyCachedPosts]);

    const refreshPosts = useCallback(async (showError = true) => {
        const isAtTop = document.documentElement.scrollTop === 0;

        if (cachedPosts.length > 0 && isAtTop) {
            applyCachedPosts();
            return;
        }

        if (!isAtTop || !channelUsername) return;

        await onRefresh(
            channelUsername,
            latestPollingOffset.current || offset,
            setIsFetching,
            setPosts,
            (newOffset) => {
                const updatedOffset = typeof newOffset === 'function'
                    ? newOffset(offset)
                    : newOffset;

                setOffset(updatedOffset);
                // Update latestPollingOffset.current when refreshing posts
                latestPollingOffset.current = updatedOffset;
            },
            showError ? showErrorSnackbar : undefined
        );

        setHasNewPosts(false);
    }, [channelUsername, offset, showErrorSnackbar, cachedPosts, applyCachedPosts]);

    const loadMorePosts = useCallback(async () => {
        if (isFetchingMore || isFetching || !channelUsername) return;

        await onMore(
            channelUsername,
            offset,
            setIsFetchingMore,
            setPosts,
            setOffset,
            setNoLoadMore,
            showErrorSnackbar
        );
    }, [
        channelUsername,
        offset,
        isFetching,
        isFetchingMore,
        showErrorSnackbar,
        setNoLoadMore
    ]);

    const showNewPosts = useCallback(() => {
        applyCachedPosts();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [applyCachedPosts]);

    return {
        posts,
        offset,
        isFetching,
        isFetchingMore,
        setNoLoadMore,
        refreshPosts,
        loadMorePosts,
        initializePosts,
        newPostCount: cachedPosts.length,
        showNewPosts,
        hasNewPosts
    };
};
