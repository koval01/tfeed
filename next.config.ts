import type { NextConfig } from "next";

const production = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    compiler: {
        removeConsole: production,
        emotion: true,
        styledComponents: {
            pure: true
        }
    }
};

export default nextConfig;
