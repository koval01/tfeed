'use client';

import { Icon28NewsfeedOutline, Icon28Smiles2Outline, Icon28UserCircleOutline } from "@vkontakte/icons";
import { CellButton, Group, Header, Panel, PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SplitLayout header={<PanelHeader delimiter="none" />}>
      <SplitCol autoSpaced>
        <Panel>
          <PanelHeader>{t("Home")}</PanelHeader>
          <Group header={<Header mode="secondary">{t("Pages")}</Header>}>
            <CellButton
              onClick={() => router.push("/feed")}
              before={<Icon28NewsfeedOutline />}
            >
              {t("Feed")}
            </CellButton>
            <CellButton
              onClick={() => router.push("/people")}
              before={<Icon28Smiles2Outline />}
            >
              {t("People")}
            </CellButton>
            <CellButton
              onClick={() => router.push("/profile")}
              before={<Icon28UserCircleOutline />}
            >
              {t("Profile")}
            </CellButton>
          </Group>
        </Panel>
      </SplitCol>
    </SplitLayout>
  );
}
