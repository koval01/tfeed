"use client";

import { useRouter } from "next/navigation";
import { Error } from "@/components/Error";
import { useTranslation } from "react-i18next";

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
