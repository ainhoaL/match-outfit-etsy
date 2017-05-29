'use strict';

console.log(process.env.NODE_ENV);

switch (process.env.NODE_ENV.trim()) {
    case 'prod':
    case 'production':
        module.exports = require('./webpack.config.dev');
        break;
    case 'test':
    case 'testing':
        module.exports = require('./webpack.config.test');
        break;
    case 'dev':
    case 'development':
    default:
        module.exports = require('./webpack.config.dev');
        break;
};
