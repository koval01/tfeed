import React from "react";

import type {
    Channel,
    Counters as CountersProps,
    TitleProps
} from "@/types";

import {
    Button,
    Card,
    DisplayTitle,
    EllipsisText,
    Footnote,
    Group,
    Paragraph,
    Placeholder,
    Spacing,
    SplitCol,
    Title as TitleVK
} from "@vkontakte/vkui";

import { Icon20Verified } from "@vkontakte/icons";

import { Avatar } from "@/components/avatar/Avatar";
import { Verified as VerifiedTT } from "@/components/feed/post/Verified";
import { TextComponent } from "@/components/feed/TextComponent";

import Link from "next/link";

import { t } from "i18next";
import { Trans } from "react-i18next";

const Verified = ({ verified }: { verified: boolean }) => (
    verified && <VerifiedTT
        className="align-baseline inline-block text-[--vkui--color_icon_accent]"
        Icon={Icon20Verified} />
)

const Title = ({ children, verified }: TitleProps) => (
    <div className="inline-flex items-center max-w-60">
        <DisplayTitle className="!leading-8 w-full whitespace-nowrap text-lg lg-h:text-xl">
            <EllipsisText>{children}</EllipsisText>
        </DisplayTitle>
        <div className="inline ml-1">
            <Verified verified={verified} />
        </div>
    </div>
)

const Counters = ({ counters }: { counters: CountersProps }) => (
    <Card>
        <div className="grid grid-cols-3 gap-2 lg-h:gap-3 p-1 lg-h:p-2 justify-items-center">
            {Object.entries(counters).map(([key, value], index) => (
                <div key={`counter__item_${index}`} className="text-center w-full">
                    <TitleVK className="block w-full text-center text-base lg-h:!text-lg" Component="h3">
                        {value}
                    </TitleVK>
                    <Footnote className="text-neutral-600 inline-block capitalize align-top mt-0.5 lg-h:mt-1 text-xs lg-h:text-sm">
                        <Trans i18nKey={key} />
                    </Footnote>
                </div>
            ))}
        </div>
    </Card>
);

const Footer = () => {
    const footerLinks = [
        { "name": "About", "href": "/page/about" },
        { "name": "Blog", "href": "//telegram.org/blog" },
        { "name": "Apps", "href": "//telegram.org/apps" },
        { "name": "Platform", "href": "//core.telegram.org" }
    ];

    return (
        <div className="text-center pt-0 pb-2">
            {footerLinks.map((item, index) => (
                <div key={`footer__l_item_${index}`} className="inline-block align-top px-2">
                    <Footnote className="text-neutral-600 text-[10px]">
                        <Link href={item.href}>
                            <Trans i18nKey={item.name} />
                        </Link>
                    </Footnote>
                </div>
            ))}
        </div>
    )
}

const Description = ({ channel }: { channel: Channel }) => (
    <Paragraph className="select-text text-xs md-h:text-sm lg-h:text-base">
        {!!channel.description && <TextComponent htmlString={channel.description.html} />}
    </Paragraph>
)

const ActionBlock = ({ channel }: { channel: Channel }) => (
    <div>
        <Counters counters={channel.counters} />
        <Spacing size={12} />
        {/* */}
        <Description channel={channel} />
        <Spacing size={16} />
        {/* */}
        <Button
            size="m"
            mode="primary"
            aria-label={t("Subscribe button")}
            onClick={() => { window.open(`https://t.me/${channel.username}`, "_blank") }}
        >
            <Trans i18nKey="Subscribe" />
        </Button>
    </div>
);

const ChannelTitle = ({ channel }: { channel: Channel }) => (
    <div className="block w-full">
        <Title verified={channel?.labels?.includes("verified") ?? false}>
            <TextComponent htmlString={channel.title.html} />
        </Title>
    </div>
)

const Body = ({ channel }: { channel: Channel }) => (
    <>
        <Placeholder
            className="pb-6"
            icon={<Avatar size={96} src={channel.avatar} name={channel.title.string} />}
            title={<ChannelTitle channel={channel} />}
            action={<ActionBlock channel={channel} />}
        >
            <span className="text-sm lg-h:text-base">
                @{channel.username}
            </span>
        </Placeholder>
        <Footer />
    </>
)

export const Profile = React.memo(({ channel }: { channel: Channel }) => (
    <SplitCol className="max-lg:hidden pt-3 ScrollStickyWrapper" width={280} maxWidth={280}>
        <div className="fixed w-[345px]">
            <Group className="select-none p-0" mode="plain">
                <div className="relative block border dark:border-[#2f3336] rounded-2xl">
                    <Body channel={channel} />
                </div>
            </Group>
        </div>
    </SplitCol>
));

Profile.displayName = "Profile";
