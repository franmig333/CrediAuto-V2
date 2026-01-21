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
          900: 'var(--color-bg)', // Dynamic Background
          800: 'var(--color-card)', // Dynamic Card
          700: '#1F1F1F', // Separators (Keep static or make dynamic if requested)
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          glow: 'var(--color-accent-glow)',
        },
        tech: {
          gray: '#9CA3AF',
          white: 'var(--color-text)', // Dynamic Text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

