var webpackConfig = require('./webpack.config.js');
var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
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
    browsers: ['PhantomJS'],
    singleRun: true,
    autoWatchBatchDelay: 300,

    frameworks: ['jasmine'],

    files: [
      {pattern: 'karma-test-shim.js', watched: true},
      {pattern: 'tests/fake.png', watched: false, included: false, served:true}
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

    proxies: {
        '/img/*': 'base/tests/fake.png'
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    }
  });
};
