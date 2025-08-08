
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/index.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        glow: {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 1 },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        glow: 'glow 1.5s ease-in-out infinite',
        pop: 'pop 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}
