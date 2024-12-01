import { type DependencyList, useEffect, useRef } from "react";

export const useInterval = (callback: () => void, delay: number, deps?: DependencyList) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current();
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay, deps]);
};
