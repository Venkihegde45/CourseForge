/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          red: '#ff006e',
          pink: '#ff006e',
          glow: '#ff006e'
        },
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#2a2a2a'
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 0, 110, 0.5), 0 0 40px rgba(255, 0, 110, 0.3)',
        'neon-lg': '0 0 30px rgba(255, 0, 110, 0.6), 0 0 60px rgba(255, 0, 110, 0.4)',
        'glow': '0 0 15px rgba(255, 0, 110, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 0, 110, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 0, 110, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}

