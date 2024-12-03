import React, { useRef, useState } from "react";
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

/**
 * Placeholder component shown during fast scrolling
 * @param height - Height of the placeholder
 */
const ScrollSeekPlaceholder = ({ height }: { height: number }) => (
    <SkeletonPost rows={height % 30} />
)

/**
 * A wrapper component that implements virtualized scrolling for large lists
 * Uses react-virtuoso for efficient rendering of only visible items
 * @template T - Generic type for list items
 */
const VirtualizedListWrapper = <T,>({
    items,
    renderItem,
    loadMoreButton,
}: VirtualizedListWrapperProps<T>) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [visibleRange, setVisibleRange] = useState([0, 0]);

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

    const render = (item: T, index: number) => {
        return renderItem(item, index);
    };

    return (
        <Div className="px-0">
            <Virtuoso<T>
                ref={virtuosoRef}
                style={{ width: "100%" }}
                data={items}
                overscan={200} // Number of items to render outside visible area
                useWindowScroll
                components={components}
                itemContent={(index, item) => render(item, index)}
                // Configuration for scroll seek behavior
                scrollSeekConfiguration={{
                    // Enter scroll seek mode when scrolling faster than 1000px/s
                    enter: (velocity) => Math.abs(velocity) > 1e3,
                    // Exit scroll seek mode when scrolling slower than 20px/s
                    exit: (velocity) => {
                        const shouldExit = Math.abs(velocity) < 20;
                        if (shouldExit) {
                            setVisibleRange([0, 0]);
                        }
                        return shouldExit;
                    },
                    // Update visible range during scroll seeking
                    change: (_velocity, { startIndex, endIndex }) => setVisibleRange([startIndex, endIndex])
                }}
            />
        </Div>
    );
};

export default VirtualizedListWrapper;
