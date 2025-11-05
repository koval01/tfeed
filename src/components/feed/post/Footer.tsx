"use client";

import { Title } from '@vkontakte/vkui';

import { t } from "i18next";

/**
 * End of content component with elegant styling
 */
export const EndOfContent = () => (
    <div className="block h-28 lg:h-32 pb-3 lg:pb-4">
        <div className="relative text-center pt-8 lg:pt-10">
            <Title
                className="opacity-80 bg-clip-text text-transparent bg-gradient-to-r from-[--vkui--color_text_secondary] to-[--vkui--color_text_tertiary]"
                weight="2"
                level="2"
            >
                {t("feedTheEnd")}
            </Title>
        </div>
    </div>
);
