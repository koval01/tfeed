import React, { type RefObject, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Div } from "@vkontakte/vkui";
import { Post as SkeletonPost } from "@/components/feed/Skeleton";
import { Virtuoso, VirtuosoHandle, Components } from "react-virtuoso";

import { TopSnack } from "@/components/feed/TopSnack";
import { selectNewPostsCount } from "@/lib/store";

/**
 * Props interface for VirtualizedListWrapper component
 * @template T - Generic type for list items
 * @property {T[]} items - Array of items to be rendered in the virtual list
 * @property {function} renderItem - Function to render individual list items
 * @property {JSX.Element} footer - Footer component
 */
type VirtualizedListWrapperProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    footer?: React.JSX.Element;
    parentRef: RefObject<HTMLDivElement | null>;
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
}: VirtualizedListWrapperProps<T>) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [currentScrollTop, setCurrentScrollTop] = useState(0);

    const newPostsCount = useSelector(selectNewPostsCount);

    const components: Components<T> = {
        Footer: () => footer,
        ...{ ScrollSeekPlaceholder }
    };

    return (
        <Div className="px-0">
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
