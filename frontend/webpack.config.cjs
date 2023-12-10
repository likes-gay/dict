/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const path = require("path");

const config = {
	entry: "./src/index.tsx",
	output: {
		path: path.resolve(__dirname, "../static"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	optimization: {
		minimizer: [
			new CssMinimizerPlugin(),
			new HtmlMinimizerPlugin({
				minimizerOptions: {
					conservativeCollapse: false
				}
			})
		],
		minimize: true
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: "src/static_original",
				}
			],
		}),
		new CleanWebpackPlugin()
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	}
};

module.exports = config;