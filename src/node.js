var Logdown = require('./base')()
var markdown = require('./markdown/node')
var ansiColors = require('./util/ansi-colors')
var isColorSupported = require('./util/is-color-supported/node')

//
// Static
//

Logdown.methodEmoji = {
  warn: '⚠️',
  error: '❌',
  info: `\u{2139}\u{FE0F}`, // Forces emoji information instead of "i" symbol
  debug: '🐞',
  log: ' '
}

Logdown._setPrefixRegExps = function () {
  // Parsing `NODE_DEBUG` and `DEBUG` env var
  var envVar = null
  if (
    typeof process !== 'undefined' &&
    process.env !== undefined
  ) {
    // `NODE_DEBUG` has precedence over `DEBUG`
    if (
      process.env['NODE_DEBUG'] !== undefined &&
      process.env['NODE_DEBUG'] !== ''
    ) {
      envVar = 'NODE_DEBUG'
    } else if (
      process.env['DEBUG'] !== undefined &&
      process.env['DEBUG'] !== ''
    ) {
      envVar = 'DEBUG'
    }

    if (envVar) {
      Logdown._prefixRegExps = []

      process.env[envVar]
        .split(',')
        .forEach(function (str) {
          str = str.trim()
          var type = 'enable'

          if (str[0] === '-') {
            str = str.substr(1)
            type = 'disable'
          }

          var regExp = Logdown._prepareRegExpForPrefixSearch(str)

          Logdown._prefixRegExps.push({
            type: type,
            regExp: regExp
          })
        })
    }
  }
}

Logdown._getNextPrefixColor = (function () {
  var lastUsed = 0
  var nodePrefixColors = [
    [31, 39], // red
    [32, 39], // green
    [33, 39], // yellow
    [34, 39], // blue
    [35, 39], // magenta
    [36, 39] // cyan
  ]

  return function () {
    lastUsed += 1
    return nodePrefixColors[lastUsed % nodePrefixColors.length]
  }
})()

//
// Instance
//

Logdown.prototype._getDecoratedPrefix = function (method) {
  var decoratedPrefix

  if (isColorSupported()) {
    decoratedPrefix =
      '\u001b[' + this.opts.prefixColor[0] + 'm' +
      '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
      this.opts.prefix +
      '\u001b[' + ansiColors.modifiers.bold[1] + 'm' +
      '\u001b[' + this.opts.prefixColor[1] + 'm'
  } else {
    decoratedPrefix = '[' + this.opts.prefix + ']'
  }

  if (method === 'warn') {
    decoratedPrefix =
      '\u001b[' + ansiColors.colors.yellow[0] + 'm' +
      Logdown.methodEmoji.warn +
      '\u001b[' + ansiColors.colors.yellow[1] + 'm  ' +
      (decoratedPrefix || '')
  } else if (method === 'error') {
    decoratedPrefix =
      '\u001b[' + ansiColors.colors.red[0] + 'm' +
      Logdown.methodEmoji.error +
      '\u001b[' + ansiColors.colors.red[1] + 'm  ' +
      (decoratedPrefix || '')
  } else if (method === 'info') {
    decoratedPrefix =
      '\u001b[' + ansiColors.colors.blue[0] + 'm' +
      Logdown.methodEmoji.info +
      '\u001b[' + ansiColors.colors.blue[1] + 'm  ' +
      (decoratedPrefix || '')
  } else if (method === 'debug') {
    decoratedPrefix =
      '\u001b[' + ansiColors.colors.gray[0] + 'm' +
      Logdown.methodEmoji.debug +
      '\u001b[' + ansiColors.colors.gray[1] + 'm  ' +
      (decoratedPrefix || '')
  } else if (method === 'log') {
    decoratedPrefix =
      '\u001b[' + ansiColors.colors.white[0] + 'm' +
      Logdown.methodEmoji.log +
      '\u001b[' + ansiColors.colors.white[1] + 'm  ' +
      (decoratedPrefix || '')
  }

  return decoratedPrefix
}

Logdown.prototype._prepareOutput = function (args, method) {
  var preparedOutput = []

  preparedOutput[0] = this._getDecoratedPrefix(method)

  args.forEach(function (arg) {
    if (typeof arg === 'string') {
      if (this.opts.markdown) {
        preparedOutput.push(markdown.parse(arg).text)
      } else {
        preparedOutput.push(arg)
      }
    } else {
      preparedOutput.push(arg)
    }
  }, this)

  return preparedOutput
}

//
// API
//

Logdown._setPrefixRegExps()

module.exports = Logdown
