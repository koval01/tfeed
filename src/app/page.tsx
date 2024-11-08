'use client';

import { Feed } from "@/components/feed";
import { Group, PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

export default function Home() {
  return (
    <SplitLayout header={<PanelHeader delimiter="none" />}>
      <SplitCol autoSpaced>
        <Group>
          Nothing
        </Group>
      </SplitCol>
    </SplitLayout>
  );
}
