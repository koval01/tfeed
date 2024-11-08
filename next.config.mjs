/** @type {import('next').NextConfig} */

const production = process.env.NODE_ENV === "production";

export default {
    images: {
        remotePatterns: [],
    },
    compiler: {
        removeConsole: production,
    }
};
