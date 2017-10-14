/* eslint-disable no-new-func */
/* global self, global */

function getGlobal (slf, glb) {
  // Return the global object based on the environment presently in.
  // window for browser and global for node.
  // Ref from -> https://github.com/purposeindustries/window-or-global/blob/master/lib/index.js
  return (
        (typeof slf === 'object' && slf.self === slf && slf) ||
        (typeof glb === 'object' && glb.global === glb && glb) ||
        this
  )
}

module.exports = getGlobal.bind(this, self, global)
module.exports.getGlobal = getGlobal
