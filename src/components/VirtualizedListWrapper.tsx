import React, { useRef } from "react";

import { Div } from "@vkontakte/vkui";
import { Virtuoso, VirtuosoHandle, Components } from "react-virtuoso";

type VirtualizedListWrapperProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    loadMoreButton: React.JSX.Element;
};

type ItemProps = {
    children?: React.ReactNode;
    style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>;

const VirtualizedListWrapper = <T,>({
    items,
    renderItem,
    loadMoreButton,
}: VirtualizedListWrapperProps<T>) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);

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

    const components: Components<T | "load-more"> = {
        Item: ItemComponent,
    };

    const renderWithLoadMore = (item: T | "load-more", index: number) => {
        if (item === "load-more") {
            return loadMoreButton;
        }
        return renderItem(item as T, index);
    };

    const enhancedItems = [...items, "load-more"] as const;

    return (
        <Div className="max-md:px-0">
            <Virtuoso<T | "load-more">
                ref={virtuosoRef}
                style={{ width: "100%" }}
                data={enhancedItems}
                overscan={200}
                useWindowScroll
                components={components}
                itemContent={(index, item) => renderWithLoadMore(item, index)}
            />
        </Div>
    );
};

export default VirtualizedListWrapper;
