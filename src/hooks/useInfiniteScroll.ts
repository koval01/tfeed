import { useEffect } from 'react';
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
    threshold = 1500
}: UseInfiniteScrollProps): void => {
    useEffect(() => {
        const handleScroll = throttle(() => {
            const scrollTop = document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const offsetCondition = documentHeight - scrollTop - windowHeight < threshold;

            if (offsetCondition && !noMoreItems && !isLoading) {
                onLoadMore();
            }
        }, 500);

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [onLoadMore, isLoading, noMoreItems, threshold]);
};
