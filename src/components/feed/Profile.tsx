import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

import {
    Group,
    SplitCol,
    useAdaptivityConditionalRender,
    Placeholder,
    Button,
    Paragraph,
    Spacing,
    Footnote,
    Title as TitleVK,
    DisplayTitle,
    Gradient
} from "@vkontakte/vkui";
import { Icon20Verified } from "@vkontakte/icons";

import { Avatar } from "@/components/Avatar";

import { TitleProps, Channel, Counters as CountersProps } from "@/types";
import Link from "next/link";

const Title = ({ children, verified }: TitleProps) => (
    <div className="inline-flex">
        <DisplayTitle level="1">{children}</DisplayTitle>
        {verified && <Icon20Verified className="align-middle inline-block text-[--vkui--color_icon_accent] ml-1 relative top-0.5" />}
    </div>
)

const Counters = ({ counters }: { counters: CountersProps }) => (
    <div className="flex whitespace-nowrap overflow-hidden max-w-72">
        {Object.entries(counters).map(([key, value], index) => (
            <div key={index} className="inline-block whitespace-normal align-top basis-1/4 pr-5 box-border">
                <TitleVK level="3" className="inline-block w-full text-left">
                    {value}
                </TitleVK>
                <Footnote className="vkuiPlaceholder__text inline-block capitalize align-top mt-1">
                    {key}
                </Footnote>
            </div>
        ))}
    </div>
)

const Footer = () => {
    const footerLinks = [
        { "name": "About", "href": "//telegram.org/faq" },
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
                            {item.name}
                        </Link>
                    </Footnote>
                </div>
            ))}
        </div>
    )
}

export const Profile = ({ channel }: { channel: Channel }) => {
    const { viewWidth } = useAdaptivityConditionalRender();
    const router = useRouter();

    return viewWidth.tabletPlus && (
        <SplitCol className={cn(viewWidth.tabletPlus.className, "ScrollStickyWrapper")} width={280} maxWidth={280}>
            <div className="fixed" style={{ width: "345px" }}>
                <Group className="select-none p-0">
                    <Gradient mode="tint" to="top" className="rounded-xl">
                        <Placeholder
                            className="pb-6"
                            icon={<Avatar size={96} src={channel.avatar} />}
                            header={<Title verified={channel.labels.includes("verified")}>{channel.title}</Title>}
                            action={
                                <>
                                    <Counters counters={channel.counters} />
                                    <Spacing size={12} />
                                    <Paragraph className="select-text">{channel.description}</Paragraph>
                                    <Spacing size={16} />
                                    <Button size="l" mode="primary" onClick={() => { router.push(`https://t.me/${channel.username}`) }}>
                                        Subscribe
                                    </Button>
                                </>
                            }
                        >
                            @{channel.username}
                        </Placeholder>
                        <Footer />
                    </Gradient>
                </Group>
            </div>
        </SplitCol>
    );
}
