"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Error } from "@/components/Error";

const NotFound = () => {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <Error header={t("Not Found")} description={t("NotFoundSubText")} actions={{
            click: () => router.push("/"), name: t("Go to home")
        }} />
    )
}

export default NotFound;
