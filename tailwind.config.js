/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"], // ✅ Required for Tailwind to scan files
    theme: {
      extend: {
        boxShadow: {
          lg: "0 3px 9px -3px #ffffff, 0 4px 6px -4px rgba(0, 0, 0, 0.1)", // ✅ Corrected shadow color
        },
      },
    },
    plugins: [require("@tailwindcss/forms")], // ✅ Correct plugin syntax
  };
  