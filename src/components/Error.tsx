import { Placeholder, SplitCol, SplitLayout, Paragraph, Button } from "@vkontakte/vkui";

import type { Error as ErrorProps, ServerError } from "@/types";
import { AxiosError } from "axios";

import { FixedCenter } from "@/components/fixed-center";
import { Icons } from "@/components/icons";

import { useRouter } from "next/navigation";


function ErrorBody({ header, description, actions }: ErrorProps) {
    return (
        <Placeholder
            icon={<Icons.logo className="size-16 md:size-24 lg:size-32 xl:size-40" />}
            header={header}
            action={!!actions ? (
                <Button type="primary" size="l" onClick={actions.click}>
                    {actions.name}
                </Button>
            ) : null}
            className="select-none"
        >
            <Paragraph>
                {description}
            </Paragraph>
        </Placeholder>
    );
}

export function Error({ header, description, actions, error }: ErrorProps) {
    if (error instanceof AxiosError) {
        const router = useRouter();
        const errorData: ServerError = error.response?.data || {};

        return (
            <FixedCenter>
                <ErrorBody header={errorData?.detail || ""} description={error.message} actions={{
                    click: () => router.push("/"), name: "Go to home"
                }} />
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
