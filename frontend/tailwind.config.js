/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Waste type colors
        'waste-yellow': '#FCD34D',
        'waste-red': '#EF4444',
        'waste-white': '#F3F4F6',
        'waste-blue': '#3B82F6',
        // Brand color
        'brand': {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        }
      }
    },
  },
  plugins: [],
}
