/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#0ea5e9', // Sky 500 (Brighter)
          700: '#0284c7', // Sky 600
        },
        secondary: {
          500: '#06b6d4', // Cyan 500
          600: '#0891b2', // Cyan 600
        },
        bg: {
          primary: '#0f172a',   // Slate 900
          secondary: '#1e293b', // Slate 800
          tertiary: '#334155',  // Slate 700
        },
        text: {
          primary: '#f1f5f9',   // Slate 100
          secondary: '#cbd5e1', // Slate 300
          tertiary: '#94a3b8',  // Slate 400
        },
        accent: {
          pink: '#ec4899',
          green: '#10b981',
          yellow: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
