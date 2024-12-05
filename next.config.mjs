const production = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
export default {
    compiler: {
        removeConsole: production,
    }
};
