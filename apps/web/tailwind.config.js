/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accentPurple: {
          DEFAULT: '#7b57ff',
          hover: '#9173ff',
          light: '#F3F0FF'
        },
        navy: {
          DEFAULT: '#0F1B2E',
          900: '#0F1B2E',
          800: '#1A2942',
          700: '#2A3C58',
          600: '#3B4E6B',
          500: '#4D6282',
          100: '#F0F4F8',
          50: '#F7FAFC'
        },
        steel: {
          DEFAULT: '#3E5871',
          900: '#253748',
          700: '#3E5871',
          500: '#5A7692',
          300: '#8DA4BE',
          100: '#E4ECF3',
          50: '#F4F7FA'
        },
        brass: {
          DEFAULT: '#A9793A',
          dark: '#8C6028',
          light: '#C49859',
          subtle: '#FAF4EB',
          ring: '#E0C097'
        },
        chart: {
          bg: '#FAFAF8',
          surface: '#FFFFFF',
          border: 'rgba(15, 27, 46, 0.08)'
        },
        status: {
          feasible: '#2D6A4F',
          feasibleBg: '#F0F7F4',
          feasibleBorder: '#B7E4C7',
          rejected: '#A32D2D',
          rejectedBg: '#FDF2F2',
          rejectedBorder: '#F87171',
          warning: '#9C6615',
          warningBg: '#FFF8E7',
          warningBorder: '#FDE68A',
          info: '#2C5282',
          infoBg: '#EBF8FF',
          infoBorder: '#90CDF4'
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Newsreader"', 'Georgia', 'serif'],
        display: ['"Fraunces"', '"Newsreader"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card-soft': '2px 2px 20px rgba(0, 0, 0, 0.062)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        'pill': '20px',
      }
    },
  },
  plugins: [],
}
