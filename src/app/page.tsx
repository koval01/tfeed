'use client';

import { FixedCenter } from "@/components/fixed-center";

import { 
  DisplayTitle,
  Headline,
  Placeholder, 
  SplitCol, 
  SplitLayout 
} from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  
  return (
    <SplitLayout>
      <SplitCol autoSpaced>
        <FixedCenter>
          <Placeholder>
            <DisplayTitle className="select-none">
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
}

export default Home;
