import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.json",
  ],
  safelist: [
    // Background colors
    'bg-indigo-100', 'bg-indigo-600',
    'bg-blue-100', 'bg-blue-600',
    'bg-purple-100', 'bg-purple-600',
    'bg-green-100', 'bg-green-600',
    'bg-red-100', 'bg-red-600',
    'bg-yellow-100', 'bg-yellow-600',
    'bg-orange-100', 'bg-orange-600',
    // Text colors
    'text-indigo-600',
    'text-blue-600',
    'text-purple-600',
    'text-green-600',
    'text-red-600',
    'text-yellow-600',
    'text-orange-600',
    // Border colors
    'border-indigo-100',
    'border-blue-100',
    'border-purple-100',
    'border-green-100',
    'border-red-100',
    'border-yellow-100',
    'border-orange-100',
    // Gradient colors (from-{color}-50, from-{color}-600, etc.)
    'from-indigo-50', 'from-blue-50', 'from-purple-50', 'from-green-50', 'from-red-50', 'from-yellow-50', 'from-orange-50',
    'from-indigo-600', 'from-blue-600', 'from-purple-600', 'from-green-600', 'from-red-600', 'from-yellow-600', 'from-orange-600',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;