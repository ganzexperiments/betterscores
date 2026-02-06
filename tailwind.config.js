/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: '#FDFCFB',
        navy: '#1E293B',
        terracotta: '#C2410C',
        'royal-blue': '#1D4ED8',
        forest: '#065F46',
      },
    },
  },
  plugins: [],
};
