import { Flex, Panel, PanelHeader, Spinner, SplitLayout } from "@vkontakte/vkui";

import { MainNav } from "@/components/main-nav";
import { Posts } from "./Posts";
import { Profile } from "./Profile";

export function Feed({ data, error, isLoading }: { data: any, error: any, isLoading: boolean }) {
    return (
        <Panel>
            <PanelHeader before={<MainNav />}></PanelHeader>
            <SplitLayout center>
                {isLoading || error ? <Flex aria-busy={true} aria-live="polite" direction="column" gap={32} margin="auto">
                    <Spinner size="medium" />
                </Flex> : <>
                    <Posts data={data} />
                    <Profile data={data} />
                </>}
            </SplitLayout>
        </Panel>
    );
}
