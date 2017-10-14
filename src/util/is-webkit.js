// Is webkit? http://stackoverflow.com/a/16459606/376773
module.exports = function isWebkit () {
  try {
    return ('WebkitAppearance' in document.documentElement.style) && !/Edge/.test(navigator.userAgent)
  } catch (error) {
    return false
  }
}
