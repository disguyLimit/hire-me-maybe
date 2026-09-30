import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kairos: {
          dark: '#2C3E50',
          light: '#34495E',
          teal: '#16A085',
          amber: '#F39C12',
          bg: '#F7F9F9',
        }
      }
    },
  },
  plugins: [],
};
export default config;