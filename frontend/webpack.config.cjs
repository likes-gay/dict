/* eslint-disable typescript/no-var-requires */
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const path = require("path");

module.exports = {
	entry: "./src/index.tsx",
	output: {
		path: path.resolve(__dirname, "../static"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	//devtool: "source-map", //Include this since the code is open source
	optimization: {
		minimizer: [
			new CssMinimizerPlugin(),
			new HtmlMinimizerPlugin({
				minimizerOptions: {
					conservativeCollapse: false,
					removeOptionalTags: true,
					html5: true,
					collapseBooleanAttributes: true,
				},
			}),
		],
		minimize: true,
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: "src/static_original",
				},
			],
		}),
		new CleanWebpackPlugin(),
	],
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
	},
};