/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // WhatsApp brand palette
        wa: {
          green: '#25D366',
          teal: '#128C7E',
          dark: '#075E54',
          panel: '#111B21',
          panel2: '#202C33',
          bubble: '#005C4B',
          ink: '#0B141A',
          muted: '#8696A0',
          line: '#2A3942',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        phone: '0 30px 80px -20px rgba(0,0,0,0.55)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { transform: 'translateY(16px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        'sheet-up': { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        'pop': { '0%': { transform: 'scale(0.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'sheet-up': 'sheet-up 0.28s cubic-bezier(0.22,1,0.36,1)',
        'pop': 'pop 0.3s cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
};
