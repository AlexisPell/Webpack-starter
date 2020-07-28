const path = require('path')
const HTMLWebpackPlughin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const inDev = process.env.NODE_ENV === 'development'
const inProd = !inDev

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all',
		},
	}

	if (inProd) {
		config.minimizer = [
			new OptimizeCssAssetWebpackPlugin(),
			new TerserWebpackPlugin(),
		]
	}

	return config
}

const filename = (ext) => (inDev ? `[name].${ext}` : `[name].[hash].${ext}`)

const cssLoaders = (extra) => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: inDev,
				reloadAll: true,
			},
		},
		'css-loader',
	]

	if (extra) {
		loaders.push(extra)
	}

	return loaders
}

const babelOptions = (preset) => {
	const opts = {
		presets: ['@babel/preset-env'],
		plugins: ['@babel/plugin-proposal-class-properties'],
	}

	if (preset) {
		opts.presets.push(preset)
	}

	return opts
}

const jsLoaders = (opts) => {
	const loaders = [
		{
			loader: 'babel-loader',
			options: babelOptions(opts),
		},
	]

	if (inDev) {
		loaders.push('eslint-loader')
	}

	return loaders
}

const plugins = () => {
	const base = [
		new HTMLWebpackPlughin({
			template: './index.html',
			minify: {
				collapseWhitespace: inProd,
			},
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/assets/favicon.ico'),
					to: path.resolve(__dirname, 'dist/assets'),
				},
			],
		}),
		new MiniCssExtractPlugin({
			filename: filename('css'),
		}),
	]

	if (inProd) {
		base.push(new BundleAnalyzerPlugin())
	}

	return base
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './index.jsx'],
		analytics: './analytics.ts',
	},
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		// Remove exts from imports
		extensions: ['.js', '.json', 'jsx'],
		// Shortcuts of paths (@/path instead of ../../path)
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@components': path.resolve(__dirname, 'src/components'),
		},
	},
	// Optimisation
	optimization: optimization(),
	// Development Server
	devServer: {
		port: 3000,
		hot: inDev,
	},
	devtool: inDev ? 'source-map' : '',
	// Plugins
	plugins: plugins(),
	// Modules
	module: {
		rules: [
			// Css
			{
				test: /\.(css)$/,
				use: cssLoaders(),
			},
			// Less
			{
				test: /\.(less)$/,
				use: cssLoaders('less-loader'),
			},
			// Sass
			{
				test: /\.(sass|scss)$/,
				use: cssLoaders('sass-loader'),
			},
			// Images
			{
				test: /\.(png|jpeg|jpg|svg|gif)$/,
				use: ['file-loader'],
			},
			// Fonts
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: ['file-loader'],
			},
			// Xml
			{
				test: /\.xml$/,
				use: ['xml-loader'],
			},
			// Csv
			{
				test: /\.csv$/,
				use: ['csv-loader'],
			},
			// Babel Javascript
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: jsLoaders(),
			},
			// Typescript
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: {
					loader: 'babel-loader',
					options: babelOptions('@babel/preset-typescript'),
				},
			},
			// React
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: {
					loader: 'babel-loader',
					options: babelOptions('@babel/preset-react'),
				},
			},
		],
	},
}

// // Typescript
// {
//   test: /\.ts$/,
//   exclude: /node_modules/,
//   loader: {
//     loader: 'babel-loader',
//     options: babelOptions('@babel/preset-typescript'),
//   },
// },
// // React
// {
//   test: /\.jsx$/,
//   exclude: /node_modules/,
//   loader: {
//     loader: 'babel-loader',
//     options: babelOptions('@babel/preset-react'),
//   },
// },

// // Typescript
// {
//   test: /\.ts$/,
//   exclude: /node_modules/,
//   use: jsLoaders('@babel/preset-typescript'),
// },
// // React
// {
//   test: /\.jsx$/,
//   exclude: /node_modules/,
//   use: jsLoaders('@babel/preset-react'),
// },
