'use client';

import { useRouter } from "next/navigation";

import { initSettingsButton } from '@telegram-apps/sdk-react';

export const SettingsButtonTelegram = () => {
    const router = useRouter();
    const [settingsButton] = initSettingsButton();

    settingsButton.show();
    settingsButton.on('click', () => router.push("/settings"));

    return null;
};
