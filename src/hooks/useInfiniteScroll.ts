import { useEffect, useRef } from 'react';
import { throttle } from 'lodash';

interface UseInfiniteScrollProps {
    onLoadMore: () => Promise<void>;
    isLoading: boolean;
    noMoreItems: boolean;
    threshold?: number;
}

export const useInfiniteScroll = ({
    onLoadMore,
    isLoading,
    noMoreItems,
    threshold = 3e3,
}: UseInfiniteScrollProps): void => {
    const onLoadMoreRef = useRef(onLoadMore);

    useEffect(() => {
        onLoadMoreRef.current = onLoadMore;
    }, [onLoadMore]);

    const throttledHandler = useRef(
        throttle(async () => {
            if (isLoading || noMoreItems) return;

            const scrollTop = document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (documentHeight - scrollTop - windowHeight < threshold) {
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
