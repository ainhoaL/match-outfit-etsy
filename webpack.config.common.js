var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry:  {
        javascript: './app/main.ts',
        html: './app/index.html',
        vendor: './polyfills.browser.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
	    loaders: [
		{
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'ts',
        }, {
            test: /\.html$/,
            loader: 'file?name=[name].[ext]',
        },
        { test: /\.png$/, loader: 'url-loader?limit=100000' },
        { test: /\.less$/, loader: 'style!css!less' },
        { test: /\.css$/, loader: 'style!css' }

        ]
    },

    output: {
        filename: 'main.js',
        path: path.join(process.cwd(), 'dist')
    },

    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['vbundle'],
        filename: 'vendor.js',
        minChunks: Infinity
      })
    ]
}
