/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",          // ✅ covers your AIAgentDashboard + components
    "./src/components/**/*.{js,jsx,ts,tsx}", // ✅ ensure /ui and others are caught
    "./src/pages/**/*.{js,jsx,ts,tsx}",     // ✅ if you use pages folder (some remnants of CRA)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
