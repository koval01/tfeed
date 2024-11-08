'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from 'next/navigation';

import { initBackButton } from '@telegram-apps/sdk-react';

export const BackButtonTelegram = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [backButton] = initBackButton();

    useEffect(() => setCanGoBack(window.location.pathname !== "/"), [pathname, searchParams]);

    useEffect(() => {
        if (canGoBack) backButton.show();
        else backButton.hide();
    }, [canGoBack, backButton]);

    useEffect(() => {
        backButton.on('click', handleBack);
        return () => backButton.off('click', handleBack);
    }, [backButton]);

    const handleBack = () => {
        if (canGoBack) router.back();
    };

    return null;
};
