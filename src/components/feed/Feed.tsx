import { useEffect, useState } from "react";

import { Body, Post } from "@/types";

import { Flex, Panel, PanelHeader, Spinner, SplitLayout } from "@vkontakte/vkui";

import { MainNav } from "@/components/main-nav";
import { Posts } from "./Posts";
import { Profile } from "./Profile";

export function Feed({ data, error, isLoading }: { data: Body, error: any, isLoading: boolean }) {
    const [items, setItems] = useState<Post[]>(() => []);
    
    useEffect(() => setItems((prevItems) => [...data?.content?.posts?.slice().reverse() || [], ...prevItems]), [data]);

    return (
        <Panel>
            <PanelHeader before={<MainNav />}></PanelHeader>
            <SplitLayout center>
                {isLoading || error ? (
                    <Flex aria-busy={true} aria-live="polite" direction="column" gap={32} margin="auto">
                        <Spinner size="medium" />
                    </Flex>
                ) : (
                    <>
                        <Posts channel={data.channel} posts={items} />
                        <Profile channel={data.channel} />
                    </>
                )}
            </SplitLayout>
        </Panel>
    );
}
