var isBrowser = require('./util/is-browser')

if (isBrowser()) {
  module.exports = require('./browser')
} else {
  module.exports = require('./node')
}
