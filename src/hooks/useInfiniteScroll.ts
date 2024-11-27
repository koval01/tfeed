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
    threshold = 35,
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

            // Calculate the distance to the end of the page as a percentage
            const distanceToBottom =
                ((documentHeight - scrollTop - windowHeight) / documentHeight) * 100;

            if (distanceToBottom < threshold) {
                await onLoadMoreRef.current();
            }
        }, 1e3)
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
