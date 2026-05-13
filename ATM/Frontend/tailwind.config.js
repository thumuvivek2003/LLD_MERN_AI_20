/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        atmbg: '#0a0e27',
        atmcard: '#111a3a',
        atmpanel: '#0f1733',
        atmborder: '#1f2a52',
        atmaccent: '#06b6d4'
      },
      boxShadow: {
        glow: '0 0 30px rgba(6, 182, 212, 0.25)',
        kiosk: '0 30px 80px -20px rgba(0, 0, 0, 0.7)'
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
