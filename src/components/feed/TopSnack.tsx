import clsx from "clsx";
import { t } from "i18next";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { throttle } from "lodash";
import type { RefObject, FC } from "react";
import type { VirtuosoHandle } from "react-virtuoso";

interface TopSnackProps {
    count: number;
    currentScrollTop: number;
    onClick: () => void;
    virtuosoRef: RefObject<VirtuosoHandle | null>;
    containerRef: RefObject<HTMLDivElement | null>;
}

export const TopSnack: FC<TopSnackProps> = ({
    count,
    currentScrollTop,
    onClick,
    virtuosoRef,
    containerRef,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    const lastScrollTop = useRef(0);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isScrollingDownRef = useRef(false);
    const hasClickedRef = useRef(false);

    // Cleanup all timeouts and listeners
    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        };
    }, []);

    // Update position based on container
    useEffect(() => {
        if (!containerRef.current) return;

        const updatePosition = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setPosition({
                top: 20,
                left: rect.left + rect.width / 2,
                width: rect.width,
            });
        };

        updatePosition();
        const resizeObserver = new ResizeObserver(throttle(updatePosition, 100));

        resizeObserver.observe(containerRef.current);
        window.addEventListener("resize", updatePosition);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updatePosition);
        };
    }, [containerRef]);

    // Handle scroll changes with proper throttling
    const handleScrollChange = useCallback(
        (current: number, last: number) => {
            if (!virtuosoRef.current || count === 0 || hasClickedRef.current) return;

            const scrollUpThreshold = 50;
            const scrollDownThreshold = 30;

            // User is scrolling up and passed the threshold
            if (current < last - scrollUpThreshold && current > 10) {
                isScrollingDownRef.current = false;

                // Clear any pending hide operations
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current);
                    hideTimeoutRef.current = null;
                }

                // Only show if not already visible
                if (!isVisible && !isAnimating) {
                    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
                    showTimeoutRef.current = setTimeout(() => {
                        setIsAnimating(true);
                        setIsVisible(true);
                    }, 200);
                }
            }
            // User is scrolling down
            else if (current > last + scrollDownThreshold) {
                isScrollingDownRef.current = true;

                // Hide after delay if we're scrolling down
                if (isVisible) {
                    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
                    hideTimeoutRef.current = setTimeout(() => {
                        setIsAnimating(true);
                        setIsVisible(false);
                    }, 1e4);
                }
            }
            // User scrolled to top
            else if (current <= 10) {
                setIsAnimating(true);
                setIsVisible(false);
            }
        },
        [count, isVisible, isAnimating, virtuosoRef]
    );

    const throttledHandleScrollChange = useMemo(
        () => throttle(handleScrollChange, 200),
        [handleScrollChange]
    );

    // Track scroll position changes
    useEffect(() => {
        throttledHandleScrollChange(currentScrollTop, lastScrollTop.current);
        lastScrollTop.current = currentScrollTop;
    }, [currentScrollTop, throttledHandleScrollChange]);

    // Reset click state when new posts arrive
    useEffect(() => {
        if (count > 0) {
            hasClickedRef.current = false;
        } else {
            setIsVisible(false);
        }
    }, [count]);

    const handleClick = () => {
        if (!isVisible || isAnimating) return;

        hasClickedRef.current = true;
        setIsAnimating(true);
        setIsVisible(false);

        // Trigger click animation
        buttonRef.current?.classList.add("active-click");

        // Clear any pending operations
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);

        // Scroll to top after animation
        setTimeout(() => {
            onClick();
            virtuosoRef.current?.scrollToIndex({
                index: 0,
                align: "end",
                behavior: "smooth",
            });
        }, 300);
    };

    if (count <= 0) return null;

    return (
        <div
            className={clsx(
                "fixed z-10 will-change-transform transition-all duration-300 ease-out",
                {
                    "opacity-0 translate-y-[-20px] pointer-events-none": !isVisible && !isAnimating,
                    "opacity-100 translate-y-0": isVisible,
                    "opacity-0 translate-y-[-20px]": !isVisible && isAnimating,
                }
            )}
            style={{
                top: `${position.top + 48}px`,
                left: `${position.left}px`,
                transform: "translateX(-50%)",
                maxWidth: `${Math.min(position.width - 32, 192)}px`,
                transformOrigin: "center top",
            }}
            aria-live="polite"
            role="status"
            onTransitionEnd={() => setIsAnimating(false)}
        >
            <button
                ref={buttonRef}
                className={clsx(
                    "relative block m-auto h-10 px-6 rounded-full",
                    "bg-[--vkui--color_background_accent]",
                    "hover:bg-[--vkui--color_text_accent--hover]",
                    "shadow-lg hover:shadow-md",
                    "transition-all duration-200 ease-out",
                    "focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50",
                    "active:scale-95 active:shadow-inner",
                    "flex items-center justify-center"
                )}
                onClick={handleClick}
                onTransitionEnd={(e) => {
                    if (e.propertyName === "transform") {
                        e.currentTarget.classList.remove("active-click");
                    }
                }}
                aria-label={t("new_posts", { count })}
            >
                <span className="text-white font-medium whitespace-nowrap">
                    {t("new_posts", { count })}
                </span>
            </button>
        </div>
    );
};
