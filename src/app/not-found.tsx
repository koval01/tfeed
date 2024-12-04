"use client";

import { useRouter } from "next/navigation";

import { Error } from "@/components/error/Error";
import { t } from "i18next";

const NotFound = () => {
    const router = useRouter();

    return (
        <Error header={t("Not Found")} description={t("NotFoundSubText")} actions={{
            click: () => router.push("/"), name: t("Go to home")
        }} />
    )
}

export default NotFound;
