module.exports = function isFirefox () {
  return navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)
}
