import React, { useMemo, useRef } from "react";

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

/**
 * Props interface for virtualized list items
 */
type ItemProps = {
    children?: React.ReactNode;
    style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>;

interface WithId {
  id: string | number;
}

/**
 * Placeholder component shown during fast scrolling
 * @param height - Height of the placeholder
 */
const ScrollSeekPlaceholder = ({ height }: { height: number }) => (
    <SkeletonPost rows={Math.floor((height - 70) / 13.3)} noAnimation={true} />
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

    // Custom ItemComponent that properly forwards refs to child elements
    // This is needed for virtuoso's measurement and positioning system
    const ItemComponent = React.forwardRef<HTMLDivElement, ItemProps>(
        ({ children, ...props }, ref) => {
            const child = React.Children.only(children) as React.ReactElement;
            return React.cloneElement(child, {
                ...props,
                ref,
            });
        }
    );

    ItemComponent.displayName = "VirtuosoItem";

    // Configure components used by Virtuoso
    const components: Components<T> = {
        Item: ItemComponent,
        Footer: () => loadMoreButton,
        ...{ ScrollSeekPlaceholder }
    };

    const memoizedRender = useMemo(() => (item: T, index: number) => {
        return renderItem(item, index);
    }, [renderItem]);

    return (
        <Div className="px-0">
            <Virtuoso<T>
                ref={virtuosoRef}
                className="w-full"
                data={items}
                overscan={1e3} // Number of items to render outside visible area
                useWindowScroll
                components={components}
                itemContent={(index, item) => memoizedRender(item, index)}
                computeItemKey={(index, item) => item.id || index}
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
