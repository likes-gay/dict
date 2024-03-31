const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const path = require("path");
const webpack = require('webpack');

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
	mode: process.env.NODE_ENV == "development" ? "development" : "production",
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
		new webpack.DefinePlugin({
			'process.env.VERSION': JSON.stringify(process.env.VERSION)
		  }),
		new CleanWebpackPlugin(),
	],
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
	},
};