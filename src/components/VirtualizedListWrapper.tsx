import React, { useRef } from "react";
import { Virtuoso, VirtuosoHandle, Components } from "react-virtuoso";

type VirtualizedListWrapperProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
};

type ItemProps = {
    children?: React.ReactNode;
    style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>;

const VirtualizedListWrapper = <T,>({
    items,
    renderItem,
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

    ItemComponent.displayName = 'VirtuosoItem';

    const components: Components<T> = {
        Item: ItemComponent,
    };

    return (
        <Virtuoso<T>
            ref={virtuosoRef}
            style={{ width: '100%' }}
            data={items}
            overscan={200}
            useWindowScroll
            components={components}
            itemContent={(index, item) => renderItem(item, index)}
        />
    );
};

export default VirtualizedListWrapper;
