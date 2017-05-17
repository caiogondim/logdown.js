/* eslint-disable no-new-func */

module.exports = function getGlobal () {
  return Function('return this')()
}
