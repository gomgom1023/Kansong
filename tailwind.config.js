/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Tailwind가 사용하는 파일
  theme: {
    extend: {
      fontFamily: {
        eng_Jomolhari: ["Jomolhari", "sans-serif"],
        eulyoo: ['Eulyoo1945', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

