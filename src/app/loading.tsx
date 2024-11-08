'use client'

import TopBarProgress from "react-topbar-progress-indicator";

export default function Loading() {
    TopBarProgress.config({
        barColors: {
            "0": "#2688eb",
            "1.0": "#2688eb66"
        },
        shadowBlur: 5
    });

    return <TopBarProgress />
}
