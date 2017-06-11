const ENV = process.env.ENV = process.env.NODE_ENV = 'dev';
var config = require('./webpack.config.common');

config.devtool = 'inline-source-map';

module.exports = config;
