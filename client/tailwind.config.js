// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // HireNest — Indigo Professional Design System
        // 'green' kept as the primary accent name so all existing class refs (text-green, bg-green etc.) pick up the new indigo palette
        green: {
          DEFAULT: '#4F46E5',
          accent: '#6366F1',
          house: '#312E81',
          uplift: '#4338CA',
          light: '#E0E7FF',
        },
        gold: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          light: '#FCD34D',
          lightest: '#FFFBEB',
          dark: '#92400E',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#F87171',
          bg: 'rgba(220, 38, 38, 0.08)',
        },
        warm: {
          DEFAULT: '#D97706',
          light: '#FBBF24',
          bg: 'rgba(217, 119, 6, 0.08)',
        },
        cream: {
          DEFAULT: '#F0F4FF',
          ceramic: '#EEF2FF',
        },
        // Legacy compatibility
        "primary": "#4F46E5",
        "primaryLight": "#6366F1",
        "positive": "#059669",
        "negative": "#DC2626",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'Menlo', 'monospace'],
        body: ['Inter', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.375rem',
        'DEFAULT': '0.5rem',
        'md': '0.625rem',
        'lg': '0.75rem',
        'card': '12px',
        'pill': '50px',
        'full': '9999px',
      },
      boxShadow: {
        'warm-sm': '0 0 0.5px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)',
        'warm': '0 0 0.5px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.08)',
        'warm-lg': '0 0 0.5px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.08)',
        'warm-xl': '0 8px 24px rgba(0,0,0,0.10), 0 0 6px rgba(0,0,0,0.06)',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'indigo-glow': '0 0 20px rgba(79,70,229,0.2)',
        'whisper': '0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'frap': '0 8px 24px rgba(79,70,229,0.25)',
        'soft': '0 4px 20px rgba(0,0,0,0.05)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'pulse-indigo': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(79,70,229,0.3)' },
          '50%': { boxShadow: '0 0 0 8px rgba(79,70,229,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite linear',
        'pulse-indigo': 'pulse-indigo 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
