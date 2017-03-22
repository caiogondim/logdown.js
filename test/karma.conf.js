var conf = {
  basePath: '',

  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['mocha', 'chai', 'sinon'],

  files: [
    '../dist/logdown.js',
    'browser/*.js'
  ],

  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['dots'],

  port: 9876,

  colors: true,

  autoWatch: false,

  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-
  // launcher
  browsers: ['Chrome'],

  singleRun: false
}

module.exports = function (config) {
  config.set(conf)
}

module.exports.conf = conf
