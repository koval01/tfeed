/** @type {import('next').NextConfig} */

const production = process.env.NODE_ENV === "production";

export default {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'telegram.org',
                pathname: '/img/emoji/**'
            },
            {
                protocol: 'https',
                hostname: 'cdn1.cdn-telegram.org',
                pathname: '/file/**'
            },
            {
                protocol: 'https',
                hostname: 'cdn4.cdn-telegram.org',
                pathname: '/file/**'
            }
        ],
        imageSizes: [40, 96]
    },
    compiler: {
        removeConsole: production,
    }
};
