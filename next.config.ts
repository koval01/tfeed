import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        removeConsole: true,
        emotion: true,
        styledComponents: {
            pure: true
        }
    }
};

export default nextConfig;
