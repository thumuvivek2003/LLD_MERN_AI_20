/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wa: {
          primary: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
          light: '#f0f2f5',
          chatBg: '#ECE5DD',
          sent: '#DCF8C6',
          received: '#FFFFFF',
          panel: '#FFFFFF',
          border: '#E5E7EB',
          muted: '#667781',
          read: '#34B7F1',
        },
      },
      backgroundImage: {
        'chat-pattern':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='2' cy='2' r='1' fill='%23d9d2c7' fill-opacity='0.35'/></svg>\")",
      },
    },
  },
  plugins: [],
};
