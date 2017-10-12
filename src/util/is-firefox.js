module.exports = function isFirefox () {
  try {
    return /firefox\/(\d+)/i.test(navigator.userAgent)
  } catch (error) {
    return false
  }
}
