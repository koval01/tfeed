/** @type {import('next').NextConfig} */

const production = process.env.NODE_ENV === "production";

export default {
    compiler: {
        removeConsole: production,
    }
};
