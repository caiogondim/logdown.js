var isBrowser = require('./is-browser')
var isNode = require('./is-node')
var isWebkit = require('./is-webkit')
var isFirefox = require('./is-firefox')

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * Code took from https://github.com/visionmedia/debug/blob/master/browser.js
 */
module.exports = function isColorSupported () {
  if (isBrowser()) {
    return (isWebkit() || isFirefox())
  } else if (isNode()) {
    if (process.stdout && !process.stdout.isTTY) {
      return false
    }

    if (process.platform === 'win32') {
      return true
    }

    if ('COLORTERM' in process.env) {
      return true
    }

    if (process.env.TERM === 'dumb') {
      return false
    }

    if (
      /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)
    ) {
      return true
    }

    return false
  }
}
