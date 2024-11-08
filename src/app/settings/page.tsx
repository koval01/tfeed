'use client';

import { useCallback, useState } from 'react';

import Main from "@/components/settings/main"

import { PullToRefresh } from "@vkontakte/vkui";

export default function Settings() {
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

    return (
        <>
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                <Main
                    profile={profile}
                    interests={interests}
                    // @ts-ignore
                    onUpdateProfileData={(data) => console.log(data)}
                    // @ts-ignore
                    onUpdateInterestsData={(data) => console.log(data)}
                />
            </PullToRefresh>
        </>
    );
}
