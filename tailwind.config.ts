import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.json",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        cream: {
          DEFAULT: '#F6F2EF',
          deep: '#ECE6E0',
        },
        card: '#FBF9F7',
        ink: {
          DEFAULT: '#000000',
          soft: '#1A1A1A',
        },
        mute: '#6B6760',
        lime: {
          DEFAULT: '#D5FE9D',
          deep: '#BFEA80',
        },
        line: 'rgba(0,0,0,0.08)',
      },
      maxWidth: {
        page: '1320px',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(.2,.65,.2,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(18px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s cubic-bezier(.2,.65,.2,1)',
        slideUp: 'slideUp 0.3s cubic-bezier(.2,.65,.2,1)',
      },
    },
  },
  plugins: [],
};
export default config;
