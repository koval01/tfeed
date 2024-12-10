import type { FC } from "react";

import { Subhead, Tooltip } from "@vkontakte/vkui";

import { Icon16VerifiedProps } from "@vkontakte/icons/dist/typings/16/verified_16";
import { Icon20VerifiedProps } from "@vkontakte/icons/dist/typings/20/verified_20";

import { Trans } from "react-i18next";

interface VerifiedProps {
    className: string;
    Icon: FC<Icon20VerifiedProps> | FC<Icon16VerifiedProps>;
    channelName?: string;
}

const Header = () => (
    <span className="font-semibold text-[--vkui--color_text_link] block text-left">
        <Trans i18nKey="Verified channel" />
    </span>
);

const Message = ({ channelName }: { channelName?: string }) => (
    channelName ? (
        <Trans
            i18nKey="verified_message"
            values={{ channelName }}
            components={{
                b: <b className="text-[--vkui--color_icon_accent]" />
            }}
            key={`verified_message__${Math.random()}`}
        />
    ) : (
        <p><Trans i18nKey="verified_basic" /></p>
    )
)

const Content = ({ channelName }: { channelName?: string }) => (
    <div className="mt-2">
        <Subhead className="text-left" Component="h5">
            <Message channelName={channelName} />
        </Subhead>
    </div>
)

export const Verified = ({ className, Icon, channelName }: VerifiedProps) => (
    <Tooltip title={<Header />} description={<Content channelName={channelName} />}>
        <Icon className={className} />
    </Tooltip>
)
