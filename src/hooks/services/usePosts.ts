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
    isRefreshing: boolean;
}

export const usePosts = (
    channelUsername: string | undefined,
    showErrorSnackbar: (message: string, subtext?: string) => void,
    pollingInterval = 4e3 // 4 seconds
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
    const [isRefreshing, setIsRefreshing] = useState(false);

    const latestPollingOffset = useRef<Offset | null>(null);
    const shouldApplyCachedPosts = useRef(false);

    const processNewPosts = useCallback((newPosts: Post[], currentPosts: Post[], currentOffset: Offset) => {
        if (newPosts.length === 0) return { filteredPosts: [], updatedOffset: currentOffset };

        const existingPostIds = new Set(currentPosts.map(post => post.id));
        const filteredPosts = newPosts.filter(post => !existingPostIds.has(post.id));

        // If all posts were duplicates, we need to adjust the offset
        if (filteredPosts.length === 0 && newPosts.length > 0) {
            const highestDuplicateId = newPosts.reduce((maxId, post) =>
                post.id > maxId ? post.id : maxId, newPosts[0].id);

            return {
                filteredPosts: [],
                updatedOffset: {
                    ...currentOffset,
                    after: highestDuplicateId
                }
            };
        }

        return {
            filteredPosts,
            updatedOffset: {
                ...currentOffset,
                after: filteredPosts[0]?.id || currentOffset.after
            }
        };
    }, []);

    const applyCachedPosts = useCallback(() => {
        if (cachedPosts.length === 0) return;

        setPosts(prevPosts => {
            const combinedPosts = [...cachedPosts, ...prevPosts];

            const updatedOffset = {
                ...offset,
                after: combinedPosts[0]?.id || offset.after,
                latestPolledOffset: offset.latestPolledOffset
            };

            setOffset(updatedOffset);
            latestPollingOffset.current = updatedOffset;

            return combinedPosts;
        });

        setCachedPosts([]);
        setHasNewPosts(false);
        dispatch(resetNewPostsCount());
    }, [cachedPosts, offset, dispatch]);

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
                const { filteredPosts, updatedOffset } = processNewPosts(tempPosts, [...cachedPosts, ...posts], currentPollOffset);

                if (filteredPosts.length > 0) {
                    setCachedPosts(prev => [...filteredPosts, ...prev]);

                    latestPollingOffset.current = updatedOffset;
                    setOffset(prevOffset => ({
                        ...prevOffset,
                        latestPolledOffset: updatedOffset
                    }));

                    setHasNewPosts(true);
                    dispatch(addNewPostsCount(filteredPosts.length));
                } else if (updatedOffset.after !== currentPollOffset.after) {
                    // Only update the offset if it changed (we skipped duplicates)
                    latestPollingOffset.current = updatedOffset;
                    setOffset(prevOffset => ({
                        ...prevOffset,
                        latestPolledOffset: updatedOffset
                    }));
                }
            }

            return response;
        } catch (error) {
            console.error('Error polling for new posts:', error);
        } finally {
            setIsPolling(false);
        }
    }, [channelUsername, offset, isPolling, dispatch, cachedPosts, posts, processNewPosts]);

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
        if (isRefreshing) return;
        const isAtTop = document.documentElement.scrollTop <= window.innerHeight / 2;

        setIsRefreshing(true);
        try {
            if (cachedPosts.length > 0 && isAtTop) {
                applyCachedPosts();
                return;
            }

            if (!isAtTop || !channelUsername) return;

            const tempPosts: Post[] = [];
            const setTempPosts: Dispatch<SetStateAction<Post[]>> = (action) => {
                const newPosts = typeof action === 'function'
                    ? action(tempPosts)
                    : action;
                tempPosts.push(...newPosts);
                return;
            };

            let tempOffset: ExtendedOffset = {};
            const setTempOffset: Dispatch<SetStateAction<ExtendedOffset>> = (action) => {
                tempOffset = typeof action === 'function'
                    ? action(tempOffset)
                    : action;
                return;
            };

            await onRefresh(
                channelUsername,
                latestPollingOffset.current || offset,
                setIsFetching,
                setTempPosts,
                setTempOffset,
                showError ? showErrorSnackbar : undefined
            );

            if (tempPosts.length > 0) {
                const { filteredPosts, updatedOffset } = processNewPosts(tempPosts, posts, offset);

                if (filteredPosts.length > 0) {
                    setPosts(prevPosts => [...filteredPosts, ...prevPosts]);
                    setOffset(updatedOffset);
                    latestPollingOffset.current = updatedOffset;
                } else if (updatedOffset.after !== offset.after) {
                    // Only update the offset if it changed (we skipped duplicates)
                    setOffset(updatedOffset);
                    latestPollingOffset.current = updatedOffset;
                }
            }
        } finally {
            setIsRefreshing(false);
            setHasNewPosts(false);
        }
    }, [channelUsername, offset, showErrorSnackbar, cachedPosts, applyCachedPosts, posts, processNewPosts, isRefreshing]);

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
        hasNewPosts,
        isRefreshing
    };
};
