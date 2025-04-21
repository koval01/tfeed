import { useState, useEffect, useRef } from 'react';

interface IntersectionObserverOptions extends IntersectionObserverInit {
    freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
    elementRef: React.RefObject<HTMLDivElement | null>,
    options: IntersectionObserverOptions = { threshold: 0.1 }
): boolean => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (elementRef.current) {
            const observer = new IntersectionObserver(([entry]) => {
                setIsIntersecting(entry.isIntersecting);

                if (entry.isIntersecting && options.freezeOnceVisible) {
                    observerRef.current?.disconnect();
                }
            }, options);

            observerRef.current = observer;
            observer.observe(elementRef.current);

            return () => {
                observer.disconnect();
            };
        }
    }, [elementRef, options]);

    return isIntersecting;
};
