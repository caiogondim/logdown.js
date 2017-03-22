var isBrowser = require('./is-browser')
var isNode = require('./is-node')

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * Code took from https://github.com/visionmedia/debug/blob/master/browser.js
 */
module.exports = function isColorSupported () {
  if (isBrowser()) {
    // Is webkit? http://stackoverflow.com/a/16459606/376773
    var isWebkit = ('WebkitAppearance' in document.documentElement.style)
    // Is firebug? http://stackoverflow.com/a/398120/376773
    var isFirebug = (
      window.console &&
      (console.firebug || (console.exception && console.table))
    )
    // Is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/
    //  Web_Console#Styling_messages
    var isFirefox31Plus = (
      navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
      parseInt(RegExp.$1, 10) >= 31
    )

    return (isWebkit || isFirebug || isFirefox31Plus)
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
