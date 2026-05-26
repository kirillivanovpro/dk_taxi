/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080B12',
        graphite: '#111722',
        porcelain: '#F7F3EA',
        muted: '#A9AFBA',
        brass: '#D7B56D',
        brassSoft: '#F0DDA6',
        danger: '#C84B4B'
      },
      boxShadow: {
        quiet: '0 24px 60px rgba(0,0,0,.24)'
      }
    }
  },
  plugins: []
};
