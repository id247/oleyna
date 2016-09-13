'use strict';

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.WEBPACK_ENV || process.env.NODE_ENV || 'development';

let configId;
let server;

switch(NODE_ENV){
	case 'dnevnik':
		configId = 'production';
		server = 'dnevnik';
		break;
	case 'mosreg':
		configId = 'production';
		server = 'mosreg';
		break;
	case 'staging':
		configId = 'production';
		server = 'staging';
		break;
	default:
		configId = 'development';
		server = 'local';
}

const appSettings = path.join(__dirname, 'src/js/settings/settings-' + server + '.js');

const resolve = {
	modulesDirectories: ['node_modules'],
	extentions: ['', '.js'],
	alias: {
		appSettings: appSettings,
	}
};

const loaders = {
	babel: {   
		test: /\.js$/, 
		loader: 'babel',
		include: [
			__dirname + '/src/js'
		], 
		query: {
			cacheDirectory: true,
			presets: ['es2015']
		}
	},
	strip: {
		test: /\.js$/, 
		include: [
			__dirname + '/src/js'
		], 
		loader: 'strip-loader?strip[]=console.log' 
	}
};

const plugins = {
	env: new webpack.DefinePlugin({
		'process.env': { 
			NODE_ENV : 'production', 
		}
	}),
	uglifyJs: new webpack.optimize.UglifyJsPlugin({
		minimize: true,
		output: {
			comments: false
		},
		compress: {
			warnings: false
		}
	}),
};

const config = {

	development: {
		cache: true,
		entry: {
			[server]: './src/js',
		},
		devtool: '#inline-source-map',
		output: {
			path: __dirname + '/development/assets/js',
			filename: '[name].min.js',
			publicPath: __dirname + '/development/assets/js',
			pathinfo: true
		},

		resolve: resolve,

		module: {
			loaders: [
				loaders.babel,
			]
		},
	},

	production: {
		cache: true,
		entry: {
			[server]: ['babel-polyfill', './src/js/index'],
		},
		output: {
			path: __dirname + '/production/assets/js',
			filename: '[name].min.js',
			publicPath: __dirname + '/production/assets/js',
			pathinfo: true
		},

		resolve: resolve,

		module: {
			loaders: [
				loaders.babel,
				loaders.strip,				
			]
		},
		plugins: [  
			plugins.env,
			plugins.uglifyJs,
		]
	}
};

module.exports = config[configId];
