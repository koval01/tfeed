import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { selectNoLoadMore } from '@/lib/store';

import { throttle } from 'lodash';

interface UseInfiniteScrollProps {
    onLoadMore: () => Promise<void>;
    isLoading: boolean;
    threshold?: number;
}

export const useInfiniteScroll = ({
    onLoadMore,
    isLoading,
    threshold = 5e3,
}: UseInfiniteScrollProps): void => {
    const noLoadMore = useSelector(selectNoLoadMore);

    const onLoadMoreRef = useRef(onLoadMore);
    const noLoadMoreRef = useRef(noLoadMore);

    useEffect(() => {
        noLoadMoreRef.current = noLoadMore;
    }, [noLoadMore]);

    useEffect(() => {
        onLoadMoreRef.current = onLoadMore;
    }, [onLoadMore]);

    const throttledHandler = useRef(
        throttle(async () => {
            if (isLoading || noLoadMoreRef.current) return;

            const scrollTop = document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const distanceToBottom = documentHeight - scrollTop - windowHeight;

            if (distanceToBottom < threshold) {
                await onLoadMoreRef.current();
            }
        }, 5e2)
    ).current;

    useEffect(() => {
        const handleScroll = () => throttledHandler();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [throttledHandler]);

    useEffect(() => {
        return () => throttledHandler.cancel();
    }, [throttledHandler]);
};
