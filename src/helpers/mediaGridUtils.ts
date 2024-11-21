import { cn } from "@/lib/utils";

/**
 * Utility functions for VKMediaGrid component
 */

type LayoutConfig = {
    rows: number;
    perRow: number[];
};

/**
 * Get the layout configuration based on the number of images.
 * Determines the number of rows and how many items per row.
 */
export const getLayoutConfig = (count: number): LayoutConfig => {
    if (count === 1) return { rows: 1, perRow: [1] };
    if (count === 2) return { rows: 1, perRow: [2] };
    if (count <= 4) return { rows: 2, perRow: [2, count - 2] };
    return { rows: 2, perRow: [2, Math.max(count - 2, 3)] };
};

/**
 * Get the CSS class name for a specific item in the grid.
 */
export const getItemClass = (index: number, totalCount: number, perRow: number[]): string => {
    const classes = ['MediaGrid__thumb'];

    if (index < 2) {
        // First row items
        classes.push('MediaGrid__thumb--firstRowItem');
        if (index === 0) {
            classes.push(cn(
                "MediaGrid__thumb--topLeft",
                totalCount === 1 ? 'MediaGrid__thumb--allSide' : totalCount === 2 ? 'MediaGrid__thumb--bottomLeft' : ''
            ));
        }
        if (index === 1) {
            classes.push(cn(
                "MediaGrid__thumb--topRight",
                totalCount === 2 ? 'MediaGrid__thumb--bottomRight' : ''
            ));
        }
    } else {
        // Second row items
        classes.push('MediaGrid__thumb--secondRowItem');
        if (index === 2) classes.push('MediaGrid__thumb--secondRowItemFirstColumn');
        if (index === totalCount - 1) classes.push('MediaGrid__thumb--bottomRight');
        if (index === perRow[0]) classes.push('MediaGrid__thumb--bottomLeft');
    }

    return classes.join(' ');
};

/**
 * Determine the aspect ratio for images in the second row.
 */
export const getSecondRowAspectRatio = (totalCount: number): number => {
    if (totalCount > 4) return 1.33;
    if (totalCount === 3) return 3;
    return 1;
};
