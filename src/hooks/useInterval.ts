import { type DependencyList, useEffect, useRef } from "react";

export const useInterval = (
    callback: () => void,
    delay: number,
    deps: DependencyList = []
) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null || delay === undefined) return;
        const tick = () => savedCallback.current();
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay, ...deps]);
};
