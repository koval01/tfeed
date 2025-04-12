import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.9' },
        },
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        
        'max-sm': { 'max': '639px' },
        'max-md': { 'max': '767px' },
        'max-lg': { 'max': '1023px' },
        'max-xl': { 'max': '1279px' },
        'max-2xl': { 'max': '1535px' },

        'sm-h': { 'raw': '(min-height: 480px)' },
        'md-h': { 'raw': '(min-height: 720px)' },
        'lg-h': { 'raw': '(min-height: 900px)' },
        'xl-h': { 'raw': '(min-height: 1080px)' },
        '2xl-h': { 'raw': '(min-height: 1200px)' },

        'max-sm-h': { 'raw': '(max-height: 479px)' },
        'max-md-h': { 'raw': '(max-height: 719px)' },
        'max-lg-h': { 'raw': '(max-height: 899px)' },
        'max-xl-h': { 'raw': '(max-height: 1079px)' },
        'max-2xl-h': { 'raw': '(max-height: 1199px)' },
      }
    },
  },
  plugins: [],
};

export default config;
