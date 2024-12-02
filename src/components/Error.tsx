import { Placeholder, SplitCol, SplitLayout, Paragraph, Button } from "@vkontakte/vkui";

import type { Error as ErrorProps, ServerError } from "@/types";
import { AxiosError } from "axios";

import { FixedCenter } from "@/components/fixed-center";
import { Icons } from "@/components/icons";

import { useRouter } from "next/navigation";
import { t } from "i18next";


const ErrorBody = ({ header, description, actions }: ErrorProps) => (
    <div className="max-md:w-screen">
        <Placeholder
            icon={<Icons.logo className="size-16 md:size-24 lg:size-32 xl:size-40" />}
            header={header}
            action={!!actions ? (
                <Button type="primary" size="l" onClick={actions.click} aria-label={t("Error action button")}>
                    {actions.name}
                </Button>
            ) : null}
            className="select-none max-md:px-0"
        >
            <Paragraph>
                {description}
            </Paragraph>
        </Placeholder>
    </div>
);

export const Error = ({ header, description, actions, error }: ErrorProps) => {
    const router = useRouter();

    if (error instanceof AxiosError) {
        const errorData: ServerError = error.response?.data || {};

        const statusCodeMatch = error.message.match(/status code (\d+)/);
        const statusCode = statusCodeMatch ? statusCodeMatch[1] : "400";

        return (
            <FixedCenter>
                <ErrorBody
                    header={t(errorData?.detail || "")}
                    description={t('error_message', { statusCode })}
                    actions={{
                        click: () => router.push("/"), name: t("Go to home")
                    }}
                />
            </FixedCenter>
        );
    }

    return (
        <SplitLayout>
            <SplitCol autoSpaced>
                <FixedCenter>
                    <ErrorBody header={header} description={description} actions={actions} />
                </FixedCenter>
            </SplitCol>
        </SplitLayout>
    );
}
