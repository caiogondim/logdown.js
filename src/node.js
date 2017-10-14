var Logdown = require('./base')()
var markdown = require('./markdown/node')
var isColorSupported = require('./util/is-color-supported/node')
var chalk = require('chalk')

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

Logdown.prefixColors = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan'
]

Logdown._setPrefixRegExps = function () {
  // Parsing `NODE_DEBUG` and `DEBUG` env var
  var envVar = null
  Logdown._prefixRegExps = []

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

  return function () {
    lastUsed += 1
    return Logdown.prefixColors[lastUsed % Logdown.prefixColors.length]
  }
})()

//
// Instance
//

Logdown.prototype._getDecoratedPrefix = function (method) {
  var decoratedPrefix

  if (isColorSupported()) {
    // If is a hex color value
    if (this.opts.prefixColor[0] === '#') {
      decoratedPrefix = chalk.bold.hex(this.opts.prefixColor)(this.opts.prefix)
    } else {
      decoratedPrefix = chalk.bold[this.opts.prefixColor](this.opts.prefix)
    }
  } else {
    decoratedPrefix = '[' + this.opts.prefix + ']'
  }

  if (method === 'warn') {
    decoratedPrefix = chalk.yellow(Logdown.methodEmoji.warn) + '  ' + decoratedPrefix
  } else if (method === 'error') {
    decoratedPrefix = chalk.red(Logdown.methodEmoji.error) + '  ' + decoratedPrefix
  } else if (method === 'info') {
    decoratedPrefix = chalk.blue(Logdown.methodEmoji.info) + '  ' + decoratedPrefix
  } else if (method === 'debug') {
    decoratedPrefix = chalk.gray(Logdown.methodEmoji.debug) + '  ' + decoratedPrefix
  } else if (method === 'log') {
    decoratedPrefix = chalk.white(Logdown.methodEmoji.log) + '  ' + decoratedPrefix
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
