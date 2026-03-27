/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sua fonte Atari existente
        eightbit: ["EightBit", "monospace", "sans-serif"],
        // Nova fonte Ubuntu configurada profissionalmente
        ubuntu: ["Ubuntu", "sans-serif"], 
      },
    },
  },
  plugins: [],
}