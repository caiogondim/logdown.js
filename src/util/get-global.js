/* eslint-disable no-new-func */
/* global self, global */

module.exports = function getGlobal () {
  // Return the global object based on the environment presently in.
  // window for browser and global for node.
  // Ref from -> https://github.com/purposeindustries/window-or-global/blob/master/lib/index.js
  return (
        (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global) ||
        this
  )
}
