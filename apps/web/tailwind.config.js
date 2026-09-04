/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAFAF8',
          card: '#FFFFFF',
          subtle: '#F8FAFC',
          input: '#FFFFFF',
          border: '#E2E8F0'
        },
        cyanAccent: {
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          bright: '#0EA5E9',
          glow: 'rgba(2, 132, 199, 0.15)',
          border: 'rgba(2, 132, 199, 0.3)'
        },
        amberGold: {
          DEFAULT: '#D97706',
          bright: '#F59E0B',
          dark: '#B45309',
          glow: 'rgba(217, 119, 6, 0.15)'
        },
        accentPurple: {
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          light: '#F0F9FF'
        },
        navy: {
          DEFAULT: '#0F1B2E',
          900: '#0F1B2E',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          100: '#F1F5F9',
          50: '#F8FAFC'
        },
        steel: {
          DEFAULT: '#475569',
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
          300: '#CBD5E1',
          100: '#F1F5F9',
          50: '#F8FAFC'
        },
        brass: {
          DEFAULT: '#D97706',
          dark: '#B45309',
          light: '#F59E0B',
          subtle: '#FFFBEB',
          ring: '#F59E0B'
        },
        chart: {
          bg: '#FAFAF8',
          surface: '#FFFFFF',
          border: 'rgba(15, 23, 42, 0.08)'
        },
        status: {
          feasible: '#059669',
          feasibleBg: '#ECFDF5',
          feasibleBorder: '#A7F3D0',
          rejected: '#DC2626',
          rejectedBg: '#FEF2F2',
          rejectedBorder: '#FCA5A5',
          warning: '#D97706',
          warningBg: '#FFFBEB',
          warningBorder: '#FDE68A',
          info: '#0284C7',
          infoBg: '#F0F9FF',
          infoBorder: '#BAE6FD'
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Newsreader"', 'Georgia', 'serif'],
        display: ['"Fraunces"', '"Newsreader"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card-soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'cyan-glow': '0 0 15px rgba(2, 132, 199, 0.25)',
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
