import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        ripple: 'ripple 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'ripple-slow': 'ripple 2s cubic-bezier(0.16, 0.7, 0.3, 0.9) infinite',
        'ripple-medium': 'ripple 1.8s cubic-bezier(0.16, 0.7, 0.3, 0.9) infinite',
        'ripple-fast': 'ripple 1.6s cubic-bezier(0.16, 0.7, 0.3, 0.9) infinite',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "color-accent": "#2688eb",
        "color-premium": "#ffbd2e"
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.6' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.1' },
          '70%': { opacity: '0.05' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
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
        'max-2xl': { 'max': '1534px' },

        'sm-h': { 'raw': '(min-height: 480px)' },
        'md-h': { 'raw': '(min-height: 720px)' },
        'lg-h': { 'raw': '(min-height: 900px)' },
        'xl-h': { 'raw': '(min-height: 1080px)' },
        '2xl-h': { 'raw': '(min-height: 1200px)' },

        'max-sm-h': { 'raw': '(max-height: 480px)' },
        'max-md-h': { 'raw': '(max-height: 720px)' },
        'max-lg-h': { 'raw': '(max-height: 900px)' },
        'max-xl-h': { 'raw': '(max-height: 1080px)' },
        'max-2xl-h': { 'raw': '(max-height: 1200px)' },
      }
    },
  },
  plugins: [],
};

export default config;
