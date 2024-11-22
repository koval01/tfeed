'use client';

import { FixedCenter } from "@/components/fixed-center";
import { Icons } from "@/components/icons";
import {
    DisplayTitle,
    Div,
    Footnote,
    Group,
    Headline,
    Link,
    Paragraph,
    Placeholder,
    Spacing,
    SplitCol,
    SplitLayout
} from "@vkontakte/vkui";

import { Trans, useTranslation } from "react-i18next";

const About = () => {
    const { t } = useTranslation();

    const features = t("about.features", { returnObjects: true }) as string[];

    return (
        <SplitLayout>
            <SplitCol autoSpaced>
                <FixedCenter className="top-16">
                    <Placeholder>
                        <Icons.logo className="size-32" />
                    </Placeholder>
                </FixedCenter>
                <Group className="block mt-32 max-w-[1080px] mx-auto">
                    <div className="p-4">
                        {/* Welcome Section */}
                        <DisplayTitle level="1">
                            <Trans
                                i18nKey="about.welcome"
                                components={{ b: <b /> }}
                            />
                        </DisplayTitle>
                        <DisplayTitle level="3" className="vkuiPlaceholder__text mt-2">
                            {t("about.welcome_sub")}
                        </DisplayTitle>
                        <Spacing size={16} />

                        {/* Goal Section */}
                        <Paragraph>
                            <p>{t("about.goal")}</p>
                            <p>
                                <Trans
                                    i18nKey="about.example"
                                    values={{ url: "tfeed.koval.page/durov" }}
                                    components={{ a: <Link href="https://tfeed.koval.page/durov" /> }}
                                />
                            </p>
                        </Paragraph>
                        <Spacing size={32} />

                        {/* Features Section */}
                        <Headline className="mb-2.5 text-lg font-bold">{t("about.features_title")}</Headline>
                        <ul className="list-disc list-inside space-y-1">
                            {features.map((feature, index) => (
                                <li key={index}>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Spacing size={32} />

                        {/* How It Works Section */}
                        <Paragraph>
                            <Headline>{t("about.works")}</Headline>
                            <p>
                                <Trans
                                    i18nKey="about.disclaimer"
                                    components={{ b: <b /> }}
                                />
                            </p>
                        </Paragraph>
                        <Spacing size={32} />

                        {/* Technologies Section */}
                        <Paragraph>
                            <Headline>{t("about.tech_used")}</Headline>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>
                                    {t("about.frontend")}: Next.js, React, TailwindCSS, TypeScript
                                </li>
                                <li>
                                    {t("about.backend")}: Python, FastAPI, (Unoffical API)
                                </li>
                            </ul>
                        </Paragraph>
                        <Spacing size={32} />

                        {/* Hosting Section */}
                        <Paragraph>
                            <Headline>{t("about.hosted")}</Headline>
                            <p>
                                <Trans
                                    i18nKey="about.frontend_hosting"
                                    components={{ a: <Link href="https://pages.cloudflare.com/" /> }}
                                />
                            </p>
                            <p>
                                <Trans
                                    i18nKey="about.backend_hosting"
                                    components={{ a: <Link href="https://www.oracle.com/cloud/" /> }}
                                />
                            </p>
                        </Paragraph>
                        <Spacing size={32} />

                        {/* Feedback Section */}
                        <Paragraph>
                            <Headline>{t("about.feedback")}</Headline>
                            <p>
                                <Trans
                                    i18nKey="about.feedback_mail"
                                    values={{ email: "tfeed@koval.page" }}
                                    components={{ a: <Link href="mailto:tfeed@koval.page" /> }}
                                />
                            </p>
                        </Paragraph>
                    </div>
                </Group>
                <Div className="w-full">
                    <Footnote caps className="vkuiPlaceholder__text text-center mt-0 md:mt-3 lg:mt-6">
                        {t("about.thanks")}
                    </Footnote>
                </Div>
            </SplitCol>
        </SplitLayout>
    );
};

export default About;
