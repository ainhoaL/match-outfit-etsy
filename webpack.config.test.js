const webpack = require('webpack');
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';
var config = require('./webpack.config.common');

config.module.postLoaders = [
            /**
             * Instruments source files for subsequent code coverage.
             * See https://github.com/deepsweet/istanbul-instrumenter-loader
             */
            {
                test: /\.ts$/,
                loader: 'istanbul-instrumenter-loader?embedSource=true&noAutoWrap=true',
                exclude: [
                    'node_modules',
                    /\.(e2e|spec)\.ts$/
                ]
            }
        ];

config.devtool = 'inline-source-map';

config.ts = {
    configFileName: 'tsconfig.test.json'
};

module.exports = config;
