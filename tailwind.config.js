
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        admin: ['"DM Sans"', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        charcoal: '#0F0F11',
        'soft-black': '#161618',
        'off-white': '#F5F5F7',
        glass: 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'grain': "url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png')", 
      }
    },
  },
  plugins: [],
}
