import React, { useRef } from "react";

import { Div } from "@vkontakte/vkui";
import { Post as SkeletonPost } from "@/components/feed/Skeleton";
import { Virtuoso, VirtuosoHandle, Components } from "react-virtuoso";

/**
 * Props interface for VirtualizedListWrapper component
 * @template T - Generic type for list items
 * @property {T[]} items - Array of items to be rendered in the virtual list
 * @property {function} renderItem - Function to render individual list items
 * @property {JSX.Element} loadMoreButton - Button element for loading more items
 */
type VirtualizedListWrapperProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    loadMoreButton: React.JSX.Element;
};

interface WithId {
  id: string | number;
}

/**
 * Placeholder component shown during fast scrolling
 * @param height - Height of the placeholder
 */
const ScrollSeekPlaceholder = ({ height }: { height: number }) => (
    <SkeletonPost rows={Math.floor((height - 70) / 13.3)} noAnimation />
)

/**
 * A wrapper component that implements virtualized scrolling for large lists
 * Uses react-virtuoso for efficient rendering of only visible items
 * @template T - Generic type for list items
 */
const VirtualizedListWrapper = <T extends WithId>({
    items,
    renderItem,
    loadMoreButton,
}: VirtualizedListWrapperProps<T>) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    const components: Components<T> = {
        Footer: () => loadMoreButton,
        ...{ ScrollSeekPlaceholder }
    };

    return (
        <Div className="px-0">
            <Virtuoso<T>
                ref={virtuosoRef}
                className="w-full"
                data={items}
                overscan={6e2} // Number of items to render outside visible area
                useWindowScroll
                components={components}
                itemContent={(index, item) => renderItem(item, index)}
                computeItemKey={(_, item) => `virt__post_${item.id}`}
                scrollSeekConfiguration={{
                    // Enter scroll seek mode when scrolling faster than 800px/s
                    enter: (velocity) => Math.abs(velocity) > 8e2,
                    // Exit scroll seek mode when scrolling slower than 10px/s
                    exit: (velocity) => Math.abs(velocity) < 10,
                }}
            />
        </Div>
    );
};

export default VirtualizedListWrapper;
