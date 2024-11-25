"use client";

import React from "react";
import { FixedCenter } from "@/components/fixed-center";

import {
  DisplayTitle,
  Headline,
  Placeholder,
  SplitCol,
  SplitLayout
} from "@vkontakte/vkui";

import { useTranslation, Trans } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SplitLayout>
      <SplitCol autoSpaced>
        <FixedCenter>
          <Placeholder>
            {/* Accessible title */}
            <DisplayTitle className="select-none" aria-label={t("Nothing")}>
              <Trans i18nKey="Nothing" />
            </DisplayTitle>
          </Placeholder>
          <Headline className="text-center">
            <Trans i18nKey="MainSubText" />
          </Headline>
        </FixedCenter>
      </SplitCol>
    </SplitLayout>
  );
};

export default Home;
