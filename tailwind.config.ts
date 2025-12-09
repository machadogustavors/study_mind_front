import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', '"Sora"', ...defaultTheme.fontFamily.sans],
        sans: ['"Sora"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        midnight: '#0f172a',
        sand: '#f6f1e9',
      },
      boxShadow: {
        card: '0 20px 35px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
