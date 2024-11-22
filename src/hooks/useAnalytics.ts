import { useEffect } from "react";

type AnalyticsData = {
    id: string;
    view: string;
    timestamp: number;
};

const analyticsState = {
    viewedPosts: new Set<string>(), // Globally tracks posts that have been sent
    analyticsQueue: [] as AnalyticsData[], // Shared global queue
    timers: new Map<string, NodeJS.Timeout>(), // Timers for continuous visibility checks
    isSending: false, // Sending status to prevent duplicate requests
    retryTimeout: null as NodeJS.Timeout | null, // Retry timer for failed requests
};

export const useAnalytics = () => {
    const handleVisibility = (entry: IntersectionObserverEntry, inView: boolean) => {
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
    };

    const queueAnalytics = (data: AnalyticsData) => {
        analyticsState.analyticsQueue.push(data);
        console.debug("Queued analytics data:", analyticsState.analyticsQueue);
    };

    const batchSendAnalytics = async () => {
        const dataToSend = [...analyticsState.analyticsQueue];
        if (dataToSend.length === 0) return;

        analyticsState.isSending = true;

        try {
            if (process.env.NODE_ENV === "production")
                await sendToServer(dataToSend);
            console.debug("Analytics sent:", dataToSend);
            analyticsState.analyticsQueue = [];
            analyticsState.isSending = false;
        } catch (error) {
            console.warn("Failed to send analytics, retrying in 1 second...", error);
            analyticsState.isSending = false;

            analyticsState.retryTimeout = setTimeout(batchSendAnalytics, 3e3);
        }
    };

    const sendToServer = async (data: AnalyticsData[]) => {
        const viewsString = data.map(item => item.view).join(';');

        const body = new URLSearchParams({
            views: viewsString
        }).toString();

        await fetch("https://t.me/v/", {
            "headers": {
                "x-requested-with": "XMLHttpRequest"
            },
            "body": body,
            "method": "POST",
            "mode": "no-cors",
            "credentials": "include"
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (analyticsState.analyticsQueue.length > 0 && !analyticsState.isSending) {
                batchSendAnalytics();
            }
        }, 1e4);

        return () => clearInterval(interval);
    }, [batchSendAnalytics]);

    return { handleVisibility };
};
