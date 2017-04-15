module.exports = function isFirefox () {
  try {
    return navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)
  } catch (error) {
    return false
  }
}
