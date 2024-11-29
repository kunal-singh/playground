import config from "@playground/tailwindcss/tailwind.config";

/** @type {import("tailwindcss").Config} */
module.exports = {
  ...config,
  content: [
    "./src/**/*.{ts,tsx}",
  ],
};