import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";

export default [
	{
		files: ["*.tsx", "*.ts", "*.jsx", "*.js", "*.cjs"],
		ignores: ["node_modules/**/*"],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "module",
		},
		plugins: {
			typescript: tsPlugin,
			react: reactPlugin,
		},
		rules: {
			//...tsPlugin.rules,
			//...reactPlugin.rules,
			indent: [
				"error",
				"tab",
			],
			"linebreak-style": [
				"error",
				"unix",
			],
			quotes: [
				"error",
				"double",
			],
			semi: [
				"error",
				"always",
			],
			"quote-props": [
				"error",
				"as-needed",
			],
			"keyword-spacing": [
				"error",
				{
					before: true,
					after: true,
					overrides: {
						if: { after: false },
						for: { after: false },
					},
				},
			],
			"comma-dangle": [
				"error",
				"always-multiline",
			],
			"typescript/no-unused-vars": "warn",
			"react/react-in-jsx-scope": "off",
			"react/display-name": "off",
			"react/no-unescaped-entities": "off",
		},
	},
];