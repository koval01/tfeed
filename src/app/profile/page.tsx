'use client';

import { Group, PullToRefresh } from "@vkontakte/vkui";

import { useCallback, useState } from 'react';

import Main from '@/components/profile/main';
import Details from '@/components/profile/details';
import Gallery from '@/components/profile/gallery';

export default function Porfile() {
    const [fetching, setFetching] = useState(false);

    const onRefresh = useCallback(() => {
        setFetching(true);

        setTimeout(
            () => {
                setFetching(false);
            }, 1e3
        );
    }, []);

    const profile = {
        id: "03cef549-dda1-48b1-841b-ab39b8c4780c",
        displayName: "Yaroslav Koval",
        telegram: 1234567890,
        role: "user",
        verified: false,
        description: "Full-stack developer",
        visible: true,
        avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=Sam",
        createdAt: 1723626700,
        city: "Zürich",
        country: "Switzerland",
        personality: "INTJ"
    }
    const interests = ["books", "travel", "design", "cooking"]

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
    ]

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
