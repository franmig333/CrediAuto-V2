/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#000000', // Deep Black
          800: '#121212', // Card Backgrounds
          700: '#1F1F1F', // Separators
        },
        accent: {
          DEFAULT: '#E62429', // Red Accent
          hover: '#CC1F24',
          glow: '#E6242980',
        },
        tech: {
          gray: '#9CA3AF',
          white: '#F3F4F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

