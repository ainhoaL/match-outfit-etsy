var webpackConfig = require('./webpack.config.js');
var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-chai',
      'karma-coverage',
      'karma-coverage-istanbul-reporter', 
      'karma-webpack', 
      'karma-sourcemap-loader',
      'karma-angular',
      'karma-typescript-preprocessor',
      'karma-remap-coverage'
    ],
	  reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    autoWatchBatchDelay: 300,

    frameworks: ['jasmine'],

    files: [
      {pattern: 'karma-test-shim.js', watched: true}
    ],

    preprocessors: {
      'karma-test-shim.js': ['webpack']
    },

    coverageReporter: {
            dir: 'coverage',
            reporters: [
                {
                    type: 'json',
                    subdir: '.',
                    file: 'coverage.json'
                }
            ]
        },
        
    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    }
  });
};
