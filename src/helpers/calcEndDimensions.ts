export const calculateEndDimensions = (aspectRatio: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const maxWidth = viewportWidth * 0.9; // 90% of viewport width
    const maxHeight = viewportHeight * 0.9; // 90% of viewport height

    let endWidth = maxWidth;
    let endHeight = maxWidth / aspectRatio;

    if (endHeight > maxHeight) {
        endHeight = maxHeight;
        endWidth = maxHeight * aspectRatio;
    }

    return { endWidth, endHeight };
};
