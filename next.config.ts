import type { NextConfig } from "next";

const production = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    compiler: {
        removeConsole: production,
        emotion: true,
        styledComponents: {
            pure: true
        }
    },
    experimental: {
        optimizePackageImports: [
            '@reduxjs/toolkit',
            '@vkontakte/icons',
            '@vkontakte/vkui',
            'clsx',
            'html-react-parser',
            'i18next',
            'lodash',
            'lucide-react',
            'react',
            'react-dom',
            'react-markdown',
            'react-player',
            'react-redux',
            'react-virtuoso',
            'spoiled',
            'swr',
        ],
    },
};

module.exports = nextConfig;
