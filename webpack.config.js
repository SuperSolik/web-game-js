const webpack = require("webpack");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const glob = require("glob");

module.exports = {
	watch: true,
	entry: glob.sync("./src/*.js"),
	output: {
		path: path.resolve(__dirname, "dist"), //Output Directory
		filename: "game.min.js", //Output file
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.js$/, //Regular expression
				exclude: /(node_modules|bower_components)/,//excluded node_modules
				use: {
					loader: "babel-loader",
					options: {
						plugins: ["@babel/plugin-proposal-class-properties"],
						presets: ["@babel/preset-env"]  //Preset used for env setup
					}
				}
			}
		],
	},
	plugins: [new UglifyJsPlugin()],
};
