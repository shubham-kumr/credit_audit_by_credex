import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0faf4',
          100: '#dcf2e6',
          200: '#bbe5ce',
          300: '#89d1ae',
          400: '#55b588',
          500: '#2e9967',
          600: '#1f7f52',
          700: '#1a6643',
          800: '#175237',
          900: '#14432e',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        colored: '0 4px 14px -2px rgba(46, 153, 103, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
