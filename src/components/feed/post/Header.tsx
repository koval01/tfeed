import type { Channel } from "@/types";

import { FeedProfile } from "@/components/feed/profile/Mobile";


export const Header = ({ channel }: { channel: Channel }) => (
    <FeedProfile channel={channel} />
);
