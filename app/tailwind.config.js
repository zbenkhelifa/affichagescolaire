/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{tsx,ts,jsx,js}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a1628',
          light: '#1a3a6b',
          dark: '#060f1a',
        },
        accent: {
          DEFAULT: '#e8b84b',
          dark: '#d4a030',
          muted: 'rgba(232,184,75,0.2)',
        },
        accent2: {
          DEFAULT: '#e05c3a',
          muted: 'rgba(224,92,58,0.2)',
        },
        glass: 'rgba(255,255,255,0.06)',
        glass2: 'rgba(255,255,255,0.12)',
      },
      fontFamily: {
        syne: ['Syne', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
      animation: {
        'ticker': 'ticker-scroll 30s linear infinite',
        'pulse-dot': 'pulse-dot 2s infinite',
        'fade-slide-in': 'fadeSlideIn 0.3s ease',
      },
      keyframes: {
        'ticker-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.3)' },
        },
        fadeSlideIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
