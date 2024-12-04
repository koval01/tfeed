"use client";

import React from "react";

import { FixedCenter } from "@/components/services/FixedCenter";

import {
    DisplayTitle,
    Headline,
    Placeholder,
    SplitCol,
    SplitLayout
} from "@vkontakte/vkui";

import { t } from "i18next";
import { Trans } from "react-i18next";

const Home: React.FC = () => (
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

export default Home;
