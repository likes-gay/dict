module.exports = {
	env: {
		browser: true,
		es2024: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended"
	],
	overrides: [
		{
			env: {
				node: true
			},
			files: [
				".eslintrc.{js,cjs}"
			],
			parserOptions: {
				sourceType: "script"
			}
		}
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: [
		"@typescript-eslint",
		"react"
	],
	rules: {
		indent: [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		quotes: [
			"error",
			"double"
		],
		semi: [
			"error",
			"always"
		],
		"quote-props": [
			"error",
			"as-needed"
		],
		"@typescript-eslint/no-unused-vars": "warn",
		"react/react-in-jsx-scope": "off",
		"react/display-name": "off",
		"react/no-unescaped-entities": "off"
	},
	ignorePatterns: ["node_modules/**/*"]
};
