import { useEffect, useState } from "react";
import { Body, Post } from "@/types";

import { Panel, PanelHeader, SplitLayout } from "@vkontakte/vkui";

import { 
    Posts as PostsSkeleton, 
    Profile as ProfileSkeleton 
} from "./Skeleton";

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
                    <>
                        <PostsSkeleton />
                        <ProfileSkeleton />
                    </>
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
