'use client';

import { FixedCenter } from "@/components/fixed-center";

import { 
  DisplayTitle,
  Headline,
  Placeholder, 
  SplitCol, 
  SplitLayout 
} from "@vkontakte/vkui";

const Home = () => {
  return (
    <SplitLayout>
      <SplitCol autoSpaced>
        <FixedCenter>
          <Placeholder>
            <DisplayTitle className="select-none">
              Nothing
            </DisplayTitle>
          </Placeholder>
          <Headline className="text-center">
            Unfortunately the main page is empty for now, it is still under development.
          </Headline>
        </FixedCenter>
      </SplitCol>
    </SplitLayout>
  );
}

export default Home;
