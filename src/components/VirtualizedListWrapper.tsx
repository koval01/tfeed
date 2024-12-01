import React, { useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

type VirtualizedListWrapperProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
};

const VirtualizedListWrapper = <T,>({
    items,
    renderItem,
}: VirtualizedListWrapperProps<T>) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    return (
        <Virtuoso
            ref={virtuosoRef}
            style={{ width: '100%' }}
            data={items}
            overscan={200}
            useWindowScroll
            itemContent={(index, item) => renderItem(item, index)}
        />
    );
};

export default VirtualizedListWrapper;
