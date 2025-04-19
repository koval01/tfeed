import { useState, useEffect } from 'react';

const TAILWIND_BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

interface WindowSize {
    width: number;
    height: number;
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    is2Xl: boolean;
    breakpoint: keyof typeof TAILWIND_BREAKPOINTS | null;
}

export const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>(() => {
        const width = typeof window !== 'undefined' ? window.innerWidth : 0;
        return {
            width,
            height: typeof window !== 'undefined' ? window.innerHeight : 0,
            isSm: width >= TAILWIND_BREAKPOINTS.sm,
            isMd: width >= TAILWIND_BREAKPOINTS.md,
            isLg: width >= TAILWIND_BREAKPOINTS.lg,
            isXl: width >= TAILWIND_BREAKPOINTS.xl,
            is2Xl: width >= TAILWIND_BREAKPOINTS['2xl'],
            breakpoint: getBreakpoint(width),
        };
    });

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            setWindowSize({
                width,
                height: window.innerHeight,
                isSm: width >= TAILWIND_BREAKPOINTS.sm,
                isMd: width >= TAILWIND_BREAKPOINTS.md,
                isLg: width >= TAILWIND_BREAKPOINTS.lg,
                isXl: width >= TAILWIND_BREAKPOINTS.xl,
                is2Xl: width >= TAILWIND_BREAKPOINTS['2xl'],
                breakpoint: getBreakpoint(width),
            });
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return windowSize;
}

const getBreakpoint = (width: number): keyof typeof TAILWIND_BREAKPOINTS | null => {
    if (width >= TAILWIND_BREAKPOINTS['2xl']) return '2xl';
    if (width >= TAILWIND_BREAKPOINTS.xl) return 'xl';
    if (width >= TAILWIND_BREAKPOINTS.lg) return 'lg';
    if (width >= TAILWIND_BREAKPOINTS.md) return 'md';
    if (width >= TAILWIND_BREAKPOINTS.sm) return 'sm';
    return null;
}
