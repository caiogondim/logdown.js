module.exports = function isColorSupported () {
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
