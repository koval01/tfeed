/** @type {import('next').NextConfig} */

const production = process.env.NODE_ENV === "production";

export default {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'randomuser.me',
                pathname: '/api/portraits/**'
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                pathname: '/9.x/thumbs/svg'
            }
        ],
    },
    compiler: {
        removeConsole: production,
    }
};
