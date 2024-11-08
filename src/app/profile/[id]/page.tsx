'use client';

export const runtime = 'edge';

import { Group, PullToRefresh } from "@vkontakte/vkui";

import Main from '@/components/profile/main';
import Details from '@/components/profile/details';
import Gallery from '@/components/profile/gallery';
import { useCallback, useState } from 'react';

export default function OtherProfile({ params }: { params: { id: string } }) {
    const [fetching, setFetching] = useState(false);

    const onRefresh = useCallback(() => {
        setFetching(true);

        setTimeout(
            () => {
                setFetching(false);
            }, 1e3
        );
    }, []);

    const profile_template = {
        telegram: 1234567890,
        role: "user",
        verified: false,
        description: "Full-stack developer",
        visible: true,
        createdAt: 1723626700,
        personality: "INTJ"
    }

    const profiles = {
        "500b70f0-3754-438d-bf1c-75b85a7a7b7c": {
            id: "500b70f0-3754-438d-bf1c-75b85a7a7b7c",
            displayName: "Forest Ln",
            city: "Kyiv",
            country: "Ukraine",
            avatar: "https://randomuser.me/api/portraits/men/34.jpg",
            ...profile_template
        },
        "50c46da1-97d2-48a9-a8fa-a25641367e67": {
            id: "50c46da1-97d2-48a9-a8fa-a25641367e67",
            displayName: "Jerome Adams",
            city: "Warsaw",
            country: "Poland",
            avatar: "https://randomuser.me/api/portraits/men/88.jpg",
            ...profile_template
        },
        "e371a18b-41f6-420b-bb7a-612812754497": {
            id: "e371a18b-41f6-420b-bb7a-612812754497",
            displayName: "Kathryn Palmer",
            city: "Frankfurt am Main",
            country: "Germany",
            avatar: "https://randomuser.me/api/portraits/women/87.jpg",
            ...profile_template
        },
        "fdc6d416-a559-4aa3-bf42-5747b2f37e36": {
            id: "fdc6d416-a559-4aa3-bf42-5747b2f37e36",
            displayName: "Lawrence Wilson",
            city: "London",
            country: "United Kingdom",
            avatar: "https://randomuser.me/api/portraits/men/54.jpg",
            ...profile_template
        },
        "cf7e0437-f4fa-4034-83c1-b66fab4ed640": {
            id: "cf7e0437-f4fa-4034-83c1-b66fab4ed640",
            displayName: "Lucas Ferguson",
            city: "Amsterdam",
            country: "Netherlands",
            avatar: "https://randomuser.me/api/portraits/men/90.jpg",
            ...profile_template
        }
        
    }

    // @ts-ignore
    const profile = profiles[params.id];
    const interests = ["gaming", "cooking", "traveling"];
    const pictures = [
        {
            id: "30e8de79-0475-4f82-ae13-07793fe8770f",
            url: "https://picsum.photos/200/300",
            createdAt: 1723627494399
        },
        {
            id: "8cceaf3e-321c-4094-86ec-50ec156ff1c9",
            url: "https://picsum.photos/300/200",
            createdAt: 1723627588454
        },
        {
            id: "bb45ccc3-103c-4fde-a492-da6a5b023c3f",
            url: "https://picsum.photos/180/300",
            createdAt: 1723627605499
        },
        {
            id: "52fb29a6-39b4-4650-b6df-a629df2179a8",
            url: "https://picsum.photos/200/120",
            createdAt: 1723627630334
        },
        {
            id: "2ba9d61b-095c-4a7b-b65a-c996ea4945e6",
            url: "https://picsum.photos/150/380",
            createdAt: 1723627644002
        }
    ];

    return (
        <>
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                <Group>
                    <Main profile={profile} />
                    <Details profile={profile} interests={interests} />
                </Group>
                <Gallery pictures={pictures} profile={profile} />
            </PullToRefresh>
        </>
    );
}
