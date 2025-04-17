import React, { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Div } from "@vkontakte/vkui";
import { Post as SkeletonPost } from "@/components/feed/Skeleton";
import { Virtuoso, VirtuosoHandle, Components } from "react-virtuoso";

import { TopSnack } from "@/components/feed/TopSnack";
import { selectNewPostsCount } from "@/lib/store";

/**
 * Props interface for VirtualizedListWrapper component
 */
type VirtualizedListWrapperProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    footer?: React.JSX.Element;
    header?: React.JSX.Element;
    parentRef: RefObject<HTMLDivElement | null>;
    onVisibleItemsChange?: (visibleItems: T[]) => void;
};

interface WithId {
  id: string | number;
}

/**
 * Placeholder component shown during fast scrolling
 * @param height - Height of the placeholder
 */
const ScrollSeekPlaceholder = ({ height }: { height: number }) => (
    <SkeletonPost rows={Math.floor(Math.ceil((height - 40) / (13 + 4)))} noAnimation />
)

/**
 * A wrapper component that implements virtualized scrolling for large lists
 * Uses react-virtuoso for efficient rendering of only visible items
 * @template T - Generic type for list items
 */
const VirtualizedListWrapper = <T extends WithId>({
    items,
    parentRef,
    renderItem,
    footer,
    header,
    onVisibleItemsChange,
}: VirtualizedListWrapperProps<T>) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    const [currentScrollTop, setCurrentScrollTop] = useState(0);
    const [visibleItems, setVisibleItems] = useState<T[]>([]);

    const newPostsCount = useSelector(selectNewPostsCount);

    const components: Components<T> = {
        Footer: () => footer,
        ...{ ScrollSeekPlaceholder }
    };

    const handleRangeChange = useCallback((range: { startIndex: number; endIndex: number }) => {
        const visible = items.slice(range.startIndex, range.endIndex + 1);
        setVisibleItems(visible);

        if (onVisibleItemsChange) {
            onVisibleItemsChange(visible);
        }
    }, [items, onVisibleItemsChange]);

    useEffect(() => {
        const visibleIds = visibleItems.map(item => item.id);
        // console.log("Currently visible items IDs:", visibleIds);
    }, [visibleItems]);

    return (
        <Div className="px-0 py-0 !pt-0">
            {header} {/* This approach is used to avoid unnecessary re-renderings */}
            <TopSnack 
                count={newPostsCount}
                currentScrollTop={currentScrollTop}
                virtuosoRef={virtuosoRef} 
                onClick={() => {}} 
                containerRef={parentRef}
            />
            <Virtuoso<T>
                ref={virtuosoRef}
                className="w-full"
                data={items}
                overscan={2e3} // Number of items to render outside visible area
                useWindowScroll
                components={components}
                itemContent={(index, item) => renderItem(item, index)}
                computeItemKey={(_, item) => `virt__post_${item.id}`}
                itemsRendered={(v) => setCurrentScrollTop(v[0]?.offset || 0)}
                rangeChanged={handleRangeChange}
                scrollSeekConfiguration={{
                    // Enter scroll seek mode when scrolling faster than 2000px/s
                    enter: (velocity) => Math.abs(velocity) > 2e3,
                    // Exit scroll seek mode when scrolling slower than 50px/s
                    exit: (velocity) => Math.abs(velocity) < 50,
                }}
            />
        </Div>
    );
};

export default VirtualizedListWrapper;
