import config from "@infiniti/tailwindss/tailwind.config";

/** @type {import("tailwindcss").Config} */
module.exports = {
	...config,
	content: [
		"./src/**/*.{ts,tsx}",
	],
};
