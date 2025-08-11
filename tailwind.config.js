/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6', // A brighter blue for better contrast on dark bg
        'secondary': '#1E3A8A', // A deeper blue
        'accent': '#F59E0B', // A warm amber/orange for contrast
        'dark-bg': '#111827',    // Main dark background
        'dark-card': '#1F2937', // A slightly lighter dark for cards
        'light-text': '#F9FAFB', // Light text for dark backgrounds
        'muted-text': '#9CA3AF', // Muted/gray text for dark backgrounds
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        display: ['Poppins', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}
