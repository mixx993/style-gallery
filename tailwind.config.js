/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Noto Sans SC"',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        ink: {
          50: '#f7f7f5',
          100: '#efefeb',
          200: '#e2e2dc',
          300: '#c9c9c0',
          400: '#9a9a90',
          500: '#6b6b63',
          600: '#4a4a44',
          700: '#33332f',
          800: '#1f1f1c',
          900: '#121210',
        },
      },
      boxShadow: {
        soft: '0 8px 30px rgba(18, 18, 16, 0.06)',
      },
    },
  },
  plugins: [],
}
