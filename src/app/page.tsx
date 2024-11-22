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

import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SplitLayout>
      <SplitCol autoSpaced>
        <FixedCenter>
          <Placeholder>
            {/* Accessible title */}
            <DisplayTitle className="select-none" aria-label={t("Nothing")}>
              {t("Nothing")}
            </DisplayTitle>
          </Placeholder>
          <Headline className="text-center">
            {t("MainSubText")}
          </Headline>
        </FixedCenter>
      </SplitCol>
    </SplitLayout>
  );
};

export default Home;
