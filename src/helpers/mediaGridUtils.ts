import { cn } from "@/lib/utils";

/**
 * Layout configuration for the VKMediaGrid component.
 */
type LayoutConfig = {
    rows: number;
    perRow: number[];
};

/**
 * Determines the layout configuration based on the number of images.
 *
 * @param count - Total number of images.
 * @returns LayoutConfig - Number of rows and items per row.
 */
export const getLayoutConfig = (count: number): LayoutConfig => {
    if (count <= 0) throw new Error("Image count must be greater than 0.");

    switch (true) {
        case count === 1:
            return { rows: 1, perRow: [1] };
        case count === 2:
            return { rows: 1, perRow: [2] };
        case count <= 6:
            return { rows: 2, perRow: [2, count - 2] };
        default: {
            const [firstRow, secondRow] = [2, 3];
            const thirdRow = count - firstRow - secondRow;
            return { rows: 3, perRow: [firstRow, secondRow, thirdRow] };
        }
    }
};

/**
 * Generates the CSS class name for a specific grid item.
 *
 * @param index - Zero-based index of the grid item.
 * @param totalCount - Total number of images in the grid.
 * @param perRow - Array indicating the number of items in each row.
 * @returns A string containing the class names for the grid item.
 */
export const getItemClass = (index: number, totalCount: number, perRow: number[]): string => {
    const classes = ["MediaGrid__thumb"];
    const hasThirdRow = totalCount > 6;

    // Helper methods to keep logic clean
    const isFirstRow = (i: number) => i < perRow[0];
    const isSecondRow = (i: number) => i >= perRow[0] && i < perRow[0] + perRow[1];
    const isThirdRow = (i: number) => i >= perRow[0] + perRow[1];

    if (isFirstRow(index)) {
        classes.push("MediaGrid__thumb--firstRowItem");

        if (index === 0) {
            classes.push(
                cn(
                    "MediaGrid__thumb--topLeft",
                    totalCount === 1 && "MediaGrid__thumb--allSide MediaGrid__thumb--fullWidth",
                    totalCount === 2 && "MediaGrid__thumb--bottomLeft"
                )
            );
        } else if (index === 1) {
            classes.push(
                cn(
                    "MediaGrid__thumb--topRight",
                    totalCount === 2 && "MediaGrid__thumb--bottomRight"
                )
            );
        }
    } else if (isSecondRow(index)) {
        classes.push("MediaGrid__thumb--secondRowItem");

        if (index === perRow[0]) classes.push("MediaGrid__thumb--secondRowItemFirstColumn");

        if (!hasThirdRow) {
            // Add bottom-left and bottom-right classes for the last row when no third row exists
            if (index === perRow[0]) classes.push("MediaGrid__thumb--bottomLeft");
            if (index === perRow[0] + perRow[1] - 1) classes.push("MediaGrid__thumb--bottomRight");
        }
    } else if (isThirdRow(index)) {
        classes.push("MediaGrid__thumb--thirdRowItem");

        if (index === perRow[0] + perRow[1]) classes.push("MediaGrid__thumb--thirdRowItemFirstColumn");
        if (index === totalCount - 1) classes.push("MediaGrid__thumb--bottomRight");
    }

    return classes.join(" ");
};

/**
 * Determines the aspect ratio for images in the second row.
 *
 * @param totalCount - Total number of images in the grid.
 * @returns Aspect ratio for second row items.
 */
export const getSecondRowAspectRatio = (totalCount: number): number => {
    switch (true) {
        case totalCount > 6:
        case totalCount > 4:
            return 1.33; // Default ratio for 2+ rows
        case totalCount === 3:
            return 3; // More panoramic ratio for 3 items
        default:
            return 1; // Square aspect ratio for other cases
    }
};
