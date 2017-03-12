var conf = require('./karma.conf').conf
conf.browsers = ['Firefox']

module.exports = function (config) {
  config.set(conf)
}
