var isWebkit = require('../is-webkit')
var isFirefox = require('../is-firefox')

module.exports = function isColorSupported () {
  return (isWebkit() || isFirefox())
}
