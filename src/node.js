var Logdown = require('./base')
var markdown = require('./markdown')
var ansiColors = require('./util/ansi-colors')
var isColorSupported = require('./util/is-color-supported')

//
// Static
//

Logdown._updateEnabledDisabled = function () {
  // Parsing `NODE_DEBUG` and `DEBUG` env var.
  var envVar = null
  if (
    typeof process !== 'undefined' &&
    process.env !== undefined
  ) {
    // `NODE_DEBUG` has precedence over `DEBUG`
    if (
      process.env.NODE_DEBUG !== undefined &&
      process.env.NODE_DEBUG !== ''
    ) {
      envVar = 'NODE_DEBUG'
    } else if (
      process.env.DEBUG !== undefined &&
      process.env.DEBUG !== ''
    ) {
      envVar = 'DEBUG'
    }

    if (envVar) {
      Logdown.disable('*')
      process.env[envVar]
        .split(',')
        .forEach(function (regExp) {
          Logdown.enable(regExp)
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

Logdown.prototype._prepareOutput = function (args, method) {
  var preparedOutput = []

  if (this.opts.prefix) {
    if (isColorSupported()) {
      preparedOutput[0] =
        '\u001b[' + this.opts.prefixColor[0] + 'm' +
        '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
        this.opts.prefix +
        '\u001b[' + ansiColors.modifiers.bold[1] + 'm' +
        '\u001b[' + this.opts.prefixColor[1] + 'm'
    } else {
      preparedOutput[0] = '[' + this.opts.prefix + ']'
    }
  }

  if (method === 'warn') {
    preparedOutput[0] =
      '\u001b[' + ansiColors.colors.yellow[0] + 'm' +
      '⚠️ ' +
      '\u001b[' + ansiColors.colors.yellow[1] + 'm ' +
      (preparedOutput[0] || '')
  } else if (method === 'error') {
    preparedOutput[0] =
      '\u001b[' + ansiColors.colors.red[0] + 'm' +
      '❌ ' +
      '\u001b[' + ansiColors.colors.red[1] + 'm ' +
      (preparedOutput[0] || '')
  } else if (method === 'info') {
    preparedOutput[0] =
      '\u001b[' + ansiColors.colors.blue[0] + 'm' +
      'ℹ️' + ' ' + // When the `i` symbol has a trailling space, it don't render the emoji.
      '\u001b[' + ansiColors.colors.blue[1] + 'm ' +
      (preparedOutput[0] || '')
  } else if (method === 'debug') {
    preparedOutput[0] =
      '\u001b[' + ansiColors.colors.gray[0] + 'm' +
      '🐞 ' +
      '\u001b[' + ansiColors.colors.gray[1] + 'm ' +
      (preparedOutput[0] || '')
  }

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

module.exports = Logdown
