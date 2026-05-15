/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        e1: '#6366f1',
        e2: '#10b981',
        e3: '#f59e0b',
        e4: '#f43f5e',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
        'door-open': 'doorOpen 600ms ease-in-out',
      },
      keyframes: {
        doorOpen: {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
      },
    },
  },
  plugins: [],
};
