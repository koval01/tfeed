import { useCallback } from "react";
import { useInterval } from "@/hooks/useInterval";

type AnalyticsData = {
    id: string;
    view: string;
    timestamp: number;
};

const analyticsState = {
    viewedPosts: new Set<string>(),
    analyticsQueue: [] as AnalyticsData[],
    timers: new Map<string, NodeJS.Timeout>(),
    isSending: false,
    retryTimeout: null as NodeJS.Timeout | null,
};

export const useAnalytics = () => {
    const queueAnalytics = useCallback((data: AnalyticsData) => {
        analyticsState.analyticsQueue.push(data);
        console.debug("Queued analytics data:", analyticsState.analyticsQueue);
    }, []);
    
    const handleVisibility = useCallback(
        (entry: IntersectionObserverEntry, inView: boolean) => {
            const target = entry.target.children[0] as HTMLElement;
            if (!target) return;

            const { id, view } = target.dataset;
            if (!id || !view) return;

            if (inView && !analyticsState.viewedPosts.has(id)) {
                if (!analyticsState.timers.has(id)) {
                    const timer = setTimeout(() => {
                        if (entry.isIntersecting) {
                            queueAnalytics({ id, view, timestamp: Date.now() });
                            analyticsState.viewedPosts.add(id);
                        }
                        analyticsState.timers.delete(id);
                    }, 3e3);

                    analyticsState.timers.set(id, timer);
                }
            } else if (!inView) {
                const timer = analyticsState.timers.get(id);
                if (timer) {
                    clearTimeout(timer);
                    analyticsState.timers.delete(id);
                }
            }
        },
        [queueAnalytics]
    );

    const sendToServer = useCallback(async (data: AnalyticsData[]) => {
        const viewsString = data.map((item) => item.view).join(";");

        const body = new URLSearchParams({
            views: viewsString,
        }).toString();

        await fetch("https://t.me/v/", {
            headers: {
                "x-requested-with": "XMLHttpRequest",
            },
            body: body,
            method: "POST",
            mode: "no-cors",
            credentials: "include",
        });
    }, []);

    const batchSendAnalytics = useCallback(async () => {
        const dataToSend = [...analyticsState.analyticsQueue];
        if (dataToSend.length === 0) return;

        analyticsState.isSending = true;

        try {
            if (process.env.NODE_ENV === "production") await sendToServer(dataToSend);
            console.debug("Analytics sent:", dataToSend);
            analyticsState.analyticsQueue = [];
            analyticsState.isSending = false;
        } catch (error) {
            console.warn("Failed to send analytics, retrying in 1 second...", error);
            analyticsState.isSending = false;

            analyticsState.retryTimeout = setTimeout(batchSendAnalytics, 3e3);
        }
    }, [sendToServer]);

    useInterval(() => {
        if (analyticsState.analyticsQueue.length > 0 && !analyticsState.isSending) {
            batchSendAnalytics();
        }
    }, 1e4, [batchSendAnalytics]);

    return { handleVisibility };
};
