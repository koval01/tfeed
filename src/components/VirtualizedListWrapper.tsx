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

    const components: Components<T> = {
        Item: ItemComponent,
        Footer: () => loadMoreButton
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
                overscan={200}
                useWindowScroll
                components={components}
                itemContent={(index, item) => render(item, index)}
            />
        </Div>
    );
};

export default VirtualizedListWrapper;
