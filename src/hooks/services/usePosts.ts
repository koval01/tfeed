import { useState, useCallback, useEffect, useRef, SetStateAction, Dispatch } from 'react';
import { useDispatch } from 'react-redux';

import type { Post, Offset, Body } from '@/types';

import { setNoLoadMore as reduxSetNoLoadMore } from '@/store/postsSlice';
import { onRefresh, onMore } from '@/components/feed/actions';

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
    // Track if we've received new posts since the last time we applied them
    const [hasNewPosts, setHasNewPosts] = useState(false);

    // Keep track of the latest polling offset for future polls
    const latestPollingOffset = useRef<Offset | null>(null);

    const shouldApplyCachedPosts = useRef(false);

    const initializePosts = useCallback((data: Body) => {
        const newPosts = data?.content?.posts?.slice().reverse() || [];
        setPosts((prevPosts) => [...newPosts, ...prevPosts]);

        const offsetObject = {
            ...data?.meta?.offset,
            after: newPosts[0]?.id
        };
        setOffset(offsetObject);
        // Initialize our polling offset reference
        latestPollingOffset.current = offsetObject;
    }, []);

    const pollForNewPosts = useCallback(async () => {
        if (!channelUsername || isPolling) return;

        try {
            setIsPolling(true);

            // Create temporary state setters that will capture the values
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

            // Use the latest polling offset for the next poll
            const currentPollOffset = latestPollingOffset.current || offset;

            const response = await onRefresh(
                channelUsername,
                currentPollOffset, // Use the latest polling offset
                () => { },
                setPollPosts,
                setPollOffset,
                undefined
            );

            if (tempPosts.length > 0) {
                setCachedPosts(prev => [...tempPosts, ...prev]);

                // Store the latest polling offset for future polls
                latestPollingOffset.current = tempOffset;

                // Save the polling offset in the state for applying later
                setOffset(prevOffset => ({
                    ...prevOffset,
                    latestPolledOffset: tempOffset
                }));

                // Mark that we have new posts
                setHasNewPosts(true);
            }

            return response;
        } catch (error) {
            console.error('Error polling for new posts:', error);
        } finally {
            setIsPolling(false);
        }
    }, [channelUsername, offset, isPolling]);

    useEffect(() => {
        if (!channelUsername) return;

        const pollInterval = setInterval(() => {
            pollForNewPosts();
        }, pollingInterval);

        return () => clearInterval(pollInterval);
    }, [channelUsername, pollingInterval, pollForNewPosts]);

    useEffect(() => {
        const checkScrollPosition = () => {
            // Only check if we have cached posts to apply
            if (cachedPosts.length === 0) return;

            // Set the flag to true only when we're at the top
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

        // Set up a cleanup function
        return () => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, [cachedPosts.length]);

    useEffect(() => {
        if (shouldApplyCachedPosts.current && cachedPosts.length > 0) {
            setPosts(prevPosts => [...cachedPosts, ...prevPosts]);

            if (offset.latestPolledOffset) {
                setOffset(offset.latestPolledOffset);
            }

            setCachedPosts([]);
            setHasNewPosts(false);

            // Reset the flag
            shouldApplyCachedPosts.current = false;
        }
    }, [cachedPosts, offset]);

    const refreshPosts = useCallback(async (showError = true) => {
        // Check if user at the top of the page
        const isAtTop = document.documentElement.scrollTop === 0;

        // If user have cached posts and we're at the top, apply them
        if (cachedPosts.length > 0 && isAtTop) {
            setPosts(prevPosts => [...cachedPosts, ...prevPosts]);

            // Update offset if we have latestPolledOffset
            if (offset.latestPolledOffset) {
                setOffset(offset.latestPolledOffset);
            }

            // Clear cached posts
            setCachedPosts([]);
            setHasNewPosts(false);
            return;
        }

        if (!isAtTop) return;

        await onRefresh(
            channelUsername,
            latestPollingOffset.current || offset, // Use the latest polling offset
            setIsFetching,
            setPosts,
            setOffset,
            showError ? showErrorSnackbar : undefined
        );

        // Reset the new posts flag
        setHasNewPosts(false);
    }, [channelUsername, offset, showErrorSnackbar, cachedPosts]);

    const loadMorePosts = useCallback(async () => {
        if (isFetchingMore || isFetching) return;

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
        if (cachedPosts.length === 0) return;

        setPosts(prevPosts => [...cachedPosts, ...prevPosts]);

        if (offset.latestPolledOffset) {
            setOffset(offset.latestPolledOffset);
        }

        setCachedPosts([]);
        setHasNewPosts(false);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [cachedPosts, offset]);

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