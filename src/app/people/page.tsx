'use client';

import { useCallback, useState } from 'react';

import { PullToRefresh } from "@vkontakte/vkui";

import Recently from '@/components/people/recently';
import Nearby from '@/components/people/nearby';

export default function People() {
    const [fetching, setFetching] = useState(false);

    const onRefresh = useCallback(() => {
        setFetching(true);

        setTimeout(
            () => {
                setFetching(false);
            }, 1e3
        );
    }, []);

    const profiles = [
        {
            id: "500b70f0-3754-438d-bf1c-75b85a7a7b7c",
            displayName: "Forest Ln",
            city: "Kyiv",
            country: "Ukraine",
            avatar: "https://randomuser.me/api/portraits/men/34.jpg",
            metadata: { distance: null }
        },
        {
            id: "50c46da1-97d2-48a9-a8fa-a25641367e67",
            displayName: "Jerome Adams",
            city: "Warsaw",
            country: "Poland",
            avatar: "https://randomuser.me/api/portraits/men/88.jpg",
            metadata: { distance: null }
        },
        {
            id: "e371a18b-41f6-420b-bb7a-612812754497",
            displayName: "Kathryn Palmer",
            city: "Frankfurt am Main",
            country: "Germany",
            avatar: "https://randomuser.me/api/portraits/women/87.jpg",
            metadata: { distance: null }
        },
        {
            id: "fdc6d416-a559-4aa3-bf42-5747b2f37e36",
            displayName: "Lawrence Wilson",
            city: "London",
            country: "United Kingdom",
            avatar: "https://randomuser.me/api/portraits/men/54.jpg",
            metadata: { distance: null }
        },
        {
            id: "cf7e0437-f4fa-4034-83c1-b66fab4ed640",
            displayName: "Lucas Ferguson",
            city: "Amsterdam",
            country: "Netherlands",
            avatar: "https://randomuser.me/api/portraits/men/90.jpg",
            metadata: { distance: null }
        }
    ]

    return (
        <>
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                <Recently profiles={profiles} />
                <Nearby profiles={profiles} />
            </PullToRefresh>
        </>
    );
}
