import React from "react";
import type { Metadata } from "next";
import type { Preview } from "@/types";

import type { 
    AppLinksAndroid, 
    AppLinksApple 
} from "next/dist/lib/metadata/types/extra-types";

import { removeEmojies } from "@/helpers/string";

export const runtime = "edge";

/**
 * Builds metadata for the given channel.
 * @param channel - Channel username.
 * @param title - Optional title for the metadata.
 * @param description - Optional description for the metadata.
 * @param avatar - Optional avatar URL for OpenGraph/Twitter cards.
 */
const buildMetadata = (
    channel: string,
    title?: string,
    description?: string,
    avatar?: string
): Metadata => {
    const clearTitle = removeEmojies(`${title} (@${channel})` || `Channel @${channel}`);
    const baseDescription = description || `Channel of user @${channel}`;
    
    const channelUrl = `https://t.me/${channel}`;
    const applicationUrl = `tg://resolve?domain=${channel}`;
    const canonicalUrl = `https://tfeed.koval.page/${channel}`;

    return {
        title: clearTitle,
        description: baseDescription,
        openGraph: {
            type: "website",
            title: clearTitle,
            description: baseDescription,
            images: avatar || undefined,
        },
        twitter: {
            card: "summary",
            title: clearTitle,
            description: baseDescription,
            images: avatar || undefined,
        },
        authors: [{ name: clearTitle, url: channelUrl }],
        creator: clearTitle,
        alternates: { canonical: canonicalUrl },
        appLinks: {
            ios: { url: applicationUrl } as AppLinksApple,
            android: { url: applicationUrl } as AppLinksAndroid,
        },
    };
};

/**
 * Fetches and generates metadata for a channel.
 * @param params - Params containing the channel username.
 * @returns Metadata for the channel.
 */
export const generateMetadata = async (props: { params: Promise<{ channel: string }> }): Promise<Metadata> => {
    const params = await props.params;
    const { channel } = params;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_HOST}/v1/preview/${channel}`;

    try {
        const response = await fetch(apiUrl, {
            headers: { BackEndSecret: process.env.BACKEND_SECRET || "" },
        });

        if (!response.ok) {
            console.warn(`Error fetching metadata for "${channel}": ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch metadata for channel ${channel}`);
        }

        const metadata: Preview = await response.json();
        const { title, description, avatar } = metadata.channel;

        return buildMetadata(channel, title, description, avatar);
    } catch (error) {
        console.error(`Metadata generation failed for channel "${channel}":`, error);
        // Fallback metadata
        return buildMetadata(channel);
    }
};

/**
 * Layout component for rendering child elements.
 * @param children - React children to render.
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export default Layout;
