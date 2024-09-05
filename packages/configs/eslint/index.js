/** @type {import('eslint').Linter.BaseConfig} **/
module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
	],
	rules: {
		"@typescript-eslint/explicit-function-return-type": "off",
		"react/prop-types": "off",
		"react/no-unknown-property": "off",
		"@typescript-eslint/no-unused-vars": "off",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
