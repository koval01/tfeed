import { Button, Paragraph, Placeholder, SplitCol, SplitLayout } from "@vkontakte/vkui";

import type { Error as ErrorProps, ServerError } from "@/types";
import { AxiosError } from "axios";

import { FixedCenter } from "@/components/services/FixedCenter";
import { Icons } from "@/components/ui/Icons";

import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/hooks/utils/useWindowSize";


const ErrorBody = ({ header, description, actions }: ErrorProps) => {
    const { isXl, isMd } = useWindowSize();
    
    return(
    <div className="max-md:w-screen">
        <Placeholder
            icon={<Icons.logo className="size-16 md:size-24 lg:size-32 xl:size-40" />}
            title={header}
            action={!!actions ? (
                <Button type="primary" size={isXl ? "l" : isMd ? "m" : "s"} onClick={actions.click} aria-label={t("Error action button")}>
                    {actions.name}
                </Button>
            ) : null}
            className="select-none max-md:px-0"
        >
            <Paragraph className="select-text">
                {description}
            </Paragraph>
        </Placeholder>
    </div>
)
};

export const Error = ({ header, description, actions, error }: ErrorProps) => {
    const router = useRouter();

    if (error instanceof AxiosError) {
        const statusCode = error.code ? error.code : "Unknown";

        return (
            <FixedCenter>
                <ErrorBody
                    header={t(error.message || "")}
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
