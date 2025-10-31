import React, { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import { Div } from "@vkontakte/vkui";
import { Post as SkeletonPost } from "@/components/feed/Skeleton";
import { Virtuoso, VirtuosoHandle, Components } from "react-virtuoso";

/**
 * Props interface for VirtualizedListWrapper component
 */
type VirtualizedListWrapperProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    footer?: React.JSX.Element;
    header?: React.JSX.Element;
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
    renderItem,
    footer,
    header,
    onVisibleItemsChange,
}: VirtualizedListWrapperProps<T>) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    const components: Components<T> = {
        Footer: () => footer,
        ...{ ScrollSeekPlaceholder }
    };

    const handleRangeChange = useCallback((range: { startIndex: number; endIndex: number }) => {
        const visible = items.slice(range.startIndex, range.endIndex + 1);

        if (onVisibleItemsChange) {
            onVisibleItemsChange(visible);
        }
    }, [items, onVisibleItemsChange]);

    return (
        <Div className="px-0 py-0 !pt-0">
            {header} {/* This approach is used to avoid unnecessary re-renderings */}
            <Virtuoso<T>
                ref={virtuosoRef}
                className="w-full"
                data={items}
                overscan={100} // Number of items to render outside visible area
                useWindowScroll
                components={components}
                itemContent={(index, item) => renderItem(item, index)}
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
