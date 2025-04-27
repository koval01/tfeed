import type { RefObject, FC } from "react";
import type { VirtuosoHandle } from "react-virtuoso";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";

import clsx from "clsx";
import { t } from "i18next";
import { throttle } from "lodash";

import { Button } from "@vkontakte/vkui";

interface Position {
    top: number;
    left: number;
    width: number;
}

interface TopSnackProps {
    count: number;
    currentScrollTop: number;
    onClick: () => void;
    virtuosoRef: RefObject<VirtuosoHandle | null>;
    containerRef: RefObject<HTMLDivElement | null>;
}

const useScrollDirection = () => {
    const isScrollingDownRef = useRef(false);

    const determineDirection = useCallback((current: number, last: number) => {
        isScrollingDownRef.current = current > last;
        return isScrollingDownRef.current;
    }, []);

    return { isScrollingDownRef, determineDirection };
};

// Single Responsibility Principle: Separate position calculation logic
const usePositionCalculator = (containerRef: RefObject<HTMLDivElement | null>) => {
    const [position, setPosition] = useState<Position>({ top: 0, left: 0, width: 0 });

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

    return position;
};

const useVisibilityManager = (
    count: number,
    virtuosoRef: RefObject<VirtuosoHandle | null>,
    hasClickedRef: React.MutableRefObject<boolean>
) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            hideTimeoutRef.current && clearTimeout(hideTimeoutRef.current);
            showTimeoutRef.current && clearTimeout(showTimeoutRef.current);
        };
    }, []);

    const handleScrollChange = useCallback(
        (current: number, last: number, isScrollingDown: boolean) => {
            if (!virtuosoRef.current || count === 0 || hasClickedRef.current) return;

            const scrollUpThreshold = 50;
            const scrollDownThreshold = 30;

            if (current < last - scrollUpThreshold && current > 10) {
                // User is scrolling up
                hideTimeoutRef.current && clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;

                if (!isVisible && !isAnimating) {
                    showTimeoutRef.current && clearTimeout(showTimeoutRef.current);
                    showTimeoutRef.current = setTimeout(() => {
                        setIsAnimating(true);
                        setIsVisible(true);
                    }, 200);
                }
            } else if (isScrollingDown && current > last + scrollDownThreshold) {
                // User is scrolling down
                if (isVisible) {
                    hideTimeoutRef.current && clearTimeout(hideTimeoutRef.current);
                    hideTimeoutRef.current = setTimeout(() => {
                        setIsAnimating(true);
                        setIsVisible(false);
                    }, 1e4);
                }
            } else if (current <= 10) {
                // User scrolled to top
                setIsAnimating(true);
                setIsVisible(false);
            }
        },
        [count, isVisible, isAnimating, virtuosoRef, hasClickedRef]
    );

    return {
        isVisible,
        isAnimating,
        setIsVisible,
        setIsAnimating,
        handleScrollChange,
    };
};

export const TopSnack: FC<TopSnackProps> = ({
    count,
    currentScrollTop,
    onClick,
    virtuosoRef,
    containerRef,
}) => {
    const lastScrollTop = useRef(0);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const hasClickedRef = useRef(false);
    const { isScrollingDownRef, determineDirection } = useScrollDirection();
    const position = usePositionCalculator(containerRef);

    const {
        isVisible,
        isAnimating,
        setIsVisible,
        setIsAnimating,
        handleScrollChange,
    } = useVisibilityManager(count, virtuosoRef, hasClickedRef);

    const throttledHandleScrollChange = useMemo(
        () => throttle(handleScrollChange, 200),
        [handleScrollChange]
    );

    useEffect(() => {
        const isScrollingDown = determineDirection(currentScrollTop, lastScrollTop.current);
        throttledHandleScrollChange(currentScrollTop, lastScrollTop.current, isScrollingDown);
        lastScrollTop.current = currentScrollTop;
    }, [currentScrollTop, throttledHandleScrollChange, determineDirection]);

    useEffect(() => {
        if (count > 0) {
            hasClickedRef.current = false;
        } else {
            setIsVisible(false);
        }
    }, [count, setIsVisible]);

    const handleClick = useCallback(() => {
        if (!isVisible || isAnimating) return;

        hasClickedRef.current = true;
        setIsAnimating(true);
        setIsVisible(false);
        buttonRef.current?.classList.add("active-click");

        setTimeout(() => {
            onClick();
            virtuosoRef.current?.scrollToIndex({
                index: 0,
                align: "end",
                behavior: "smooth",
            });
        }, 300);
    },
        [isVisible, isAnimating, onClick, virtuosoRef, setIsAnimating, setIsVisible]
    );

    if (count <= 0) return null;

    return (
        <TopSnackView
            isVisible={isVisible}
            isAnimating={isAnimating}
            position={position}
            count={count}
            buttonRef={buttonRef}
            handleClick={handleClick}
            setIsAnimating={setIsAnimating}
        />
    );
};

interface TopSnackViewProps {
    isVisible: boolean;
    isAnimating: boolean;
    position: Position;
    count: number;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    handleClick: () => void;
    setIsAnimating: (value: boolean) => void;
}

const TopSnackView: FC<TopSnackViewProps> = ({
    isVisible,
    isAnimating,
    position,
    count,
    buttonRef,
    handleClick,
    setIsAnimating,
}) => (
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
        <Button
            rounded
            size="l"
            getRootRef={buttonRef}
            onClick={handleClick}
            onTransitionEnd={(e) => {
                if (e.propertyName === "transform") {
                    e.currentTarget.classList.remove("active-click");
                }
            }}
            aria-label={t("new_posts", { count })}
            className={"relative block m-auto"}
        >
            <span className="text-white font-medium whitespace-nowrap">
                {t("new_posts", { count })}
            </span>
        </Button>
    </div>
);
