import React from 'react';
import { Metadata } from 'next';

import { Preview } from '@/types';
import { AppLinksAndroid, AppLinksApple } from 'next/dist/lib/metadata/types/extra-types';

import { removeEmojies } from '@/helpers/string';

export const runtime = 'edge';

const buildMetadata = (
    channel: string,
    title?: string,
    description?: string,
    avatar?: string
): Metadata => {
    const clearTitle = removeEmojies(title || `Channel @${channel}`);
    const baseDescription = description || `Channel of user @${channel}`;

    return {
        title: title || `Channel @${channel}`,
        description: baseDescription,
        openGraph: {
            type: "website",
            title: clearTitle,
            description: baseDescription,
            images: avatar
        },
        twitter: {
            title: clearTitle,
            description: baseDescription,
            card: "summary",
            images: avatar
        },
        authors: [{ name: clearTitle, url: `https://t.me/${channel}` }],
        creator: clearTitle,
        alternates: { canonical: `https://tfeed.koval.page/${channel}` },
        appLinks: {
            ios: { url: `tg://resolve?domain=${channel}` } as AppLinksApple,
            android: { url: `tg://resolve?domain=${channel}` } as AppLinksAndroid
        }
    };
};

export const generateMetadata = async ({ params }: { params: { channel: string } }): Promise<Metadata> => {
    const { channel } = params;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/preview/${channel}`, {
            headers: { "BackEndSecret": process.env.BACKEND_SECRET || "" }
        });

        if (!response.ok) {
            console.error(`Error fetching metadata: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch metadata for channel ${channel}`);
        }

        const metadata = await response.json() as Preview;
        if (!metadata) throw new Error(`No metadata returned for channel ${channel}`);

        const { title, description, avatar } = metadata.channel;
        return buildMetadata(channel, title, description, avatar);
    } catch (error) {
        console.error(`Failed to generate metadata for channel "${channel}":`, error);

        // Fallback metadata
        return buildMetadata(channel, `Channel @${channel}`, `Channel of user @${channel}`);
    }
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => children;

export default Layout;
