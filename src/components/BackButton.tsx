'use client'

import { FC } from "react";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Icon28ChevronBack } from "@vkontakte/icons";
import { PanelHeaderButton } from "@vkontakte/vkui";


const BackButton: FC = () => {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <PanelHeaderButton
            onClick={() => router.back()}
            aria-label={t("Back")}
            className="ml-3"
        >
            <Icon28ChevronBack className="!p-0" />
        </PanelHeaderButton>
    )
};

export default BackButton;
