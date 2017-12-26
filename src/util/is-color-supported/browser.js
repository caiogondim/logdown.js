const isWebkit = require('../is-webkit')
const isFirefox = require('../is-firefox')

module.exports = function isColorSupported() {
  return isWebkit() || isFirefox()
}
