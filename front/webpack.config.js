const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin } = require('webpack')
require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'

const plugins = [
	new DefinePlugin({ 'process.env': JSON.stringify(process.env) }),
	new CleanWebpackPlugin(),
	new HtmlWebpackPlugin({
		template: 'index.html',
		minify: { collapseWhitespace: !isDev, removeComments: !isDev }
	}),
	new MiniCssExtractPlugin({
		filename: isDev ? '[name].css' : '[name].[hash].css',
		chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
	})
]

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode,
	entry: './index.js',
	output: {
		filename: isDev ? '[name].js' : '[name].[hash].js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'public/[name].[hash][ext][query]'
	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': path.resolve(__dirname, 'src/')
		}
	},
	devtool: isDev ? 'source-map' : false,
	devServer: {
		port: 3300,
		hot: true,
		static: { directory: path.join(__dirname, 'public') },
		historyApiFallback: true
	},
	optimization: {
		minimize: !isDev,
		minimizer: [
			new CssMinimizerPlugin(),
			// new TerserPlugin({
			// 	parallel: false,
			// 	terserOptions: {
			// 		format: {
			// 			comments: false
			// 		}
			// 	}
			// })
		]
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.module\.s[ac]ss$/,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[local]_[hash:base64:5]'
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /^((?!\.module).)*s[ac]ss$/,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
}
