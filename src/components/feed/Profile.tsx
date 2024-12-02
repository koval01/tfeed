import type { TitleProps, Channel, Counters as CountersProps } from "@/types";

import {
    Group,
    SplitCol,
    Placeholder,
    Button,
    Paragraph,
    Spacing,
    Footnote,
    Title as TitleVK,
    DisplayTitle,
    Gradient,
    Card,
    EllipsisText
} from "@vkontakte/vkui";

import { Icon20Verified } from "@vkontakte/icons";

import { Avatar } from "@/components/Avatar";
import { Verified as VerifiedTT } from "@/components/feed/Verified";
import { TextComponent } from "@/components/feed/TextComponent";

import Link from "next/link";

import { Trans } from "react-i18next";
import { t } from "i18next";

const Verified = ({ verified }: { verified: boolean }) => (
    verified && <VerifiedTT
        className="align-baseline inline-block text-[--vkui--color_icon_accent]"
        Icon={Icon20Verified} />
)

const Title = ({ children, verified }: TitleProps) => (
    <div className="inline-flex items-center max-w-60">
        <DisplayTitle level="1" className="!leading-8 w-full whitespace-nowrap">
            <EllipsisText>{children}</EllipsisText>
        </DisplayTitle>
        <div className="inline ml-1">
            <Verified verified={verified} />
        </div>
    </div>
)

const Counters = ({ counters }: { counters: CountersProps }) => (
    <Card>
        <div className="grid grid-cols-3 gap-3 p-2 justify-items-center">
            {Object.entries(counters).map(([key, value], index) => (
                <div key={index} className="text-center w-full">
                    <TitleVK level="3" className="block w-full text-center">
                        {value}
                    </TitleVK>
                    <Footnote className="vkuiPlaceholder__text inline-block capitalize align-top mt-1">
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
                <div key={index} className="inline-block align-top px-2">
                    <Footnote className="vkuiPlaceholder__text">
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
    <Paragraph className="select-text">
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
            size="l"
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
        <Title verified={channel.labels.includes("verified")}>
            <TextComponent htmlString={channel.title.html} />
        </Title>
    </div>
)

const Body = ({ channel }: { channel: Channel }) => (
    <Gradient mode="tint" to="top" className="rounded-xl">
        <Placeholder
            className="pb-6"
            icon={<Avatar size={96} src={channel.avatar} name={channel.title.string} />}
            header={<ChannelTitle channel={channel} />}
            action={<ActionBlock channel={channel} />}
        >
            @{channel.username}
        </Placeholder>
        <Footer />
    </Gradient>
)

export const Profile = ({ channel }: { channel: Channel }) => (
    <SplitCol className="max-lg:hidden pt-3 ScrollStickyWrapper" width={280} maxWidth={280}>
        <div className="fixed w-[345px]">
            <Group className="select-none p-0">
                <Body channel={channel} />
            </Group>
        </div>
    </SplitCol>
)
