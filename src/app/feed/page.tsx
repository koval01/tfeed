'use client';

import { Icon56NewsfeedOutline } from '@vkontakte/icons';
import { Group, Placeholder } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

export default function Feed() {
    const { t } = useTranslation();

    return (
        <Group style={{ minHeight: '400px' }}>
            <Placeholder icon={<Icon56NewsfeedOutline width={56} height={56} />} />
            <div className="flex justify-center items-center w-full">
                <div className="text-left text-5xl text-neutral-400 font-black uppercase">
                    <span className="block">{t("probably")}</span>
                    <span className="block">{t("now")}</span>
                    <span className="block">{t("here")}</span>
                    <span className="block">{t("nothing")}</span>
                </div>
            </div>
        </Group>
    );
}
