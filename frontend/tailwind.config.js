/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neutral surfaces (ink base + raised layers)
        ink: {
          950: '#080A0F',
          900: '#0B0E14',
          800: '#141925',
          700: '#1E2534',
          600: '#2A3342',
        },
        // Signature spectrum: violet -> cyan (used sparingly)
        iris: {
          400: '#9B8FFF',
          500: '#7C6CFF',
          600: '#6355E6',
        },
        spectrum: {
          cyan: '#3BE0D0',
          violet: '#7C6CFF',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'spectrum-gradient':
          'linear-gradient(120deg, #7C6CFF 0%, #6355E6 45%, #3BE0D0 100%)',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(124, 108, 255, 0.45)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        develop: {
          '0%': { opacity: '0', filter: 'blur(16px)', transform: 'scale(1.02)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        develop: 'develop 0.7s ease-out',
      },
    },
  },
  plugins: [],
};
