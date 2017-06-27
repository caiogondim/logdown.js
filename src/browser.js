var Logdown = require('./base')()
var markdown = require('./markdown/browser')
var isColorSupported = require('./util/is-color-supported/browser')
var globalObject = require('./util/get-global')()

//
// Static
//

Logdown._updateEnabledDisabled = function () {
  try {
    if (
      globalObject.localStorage &&
      typeof globalObject.localStorage.getItem('debug') === 'string'
    ) {
      Logdown.disable('*')
      globalObject.localStorage
        .getItem('debug')
        .split(',')
        .forEach(function (regExp) {
          Logdown.enable(regExp)
        })
    }
  } catch (error) {}
}

Logdown._getNextPrefixColor = (function () {
  var lastUsed = 0
  // Tomorrow Night Eighties colors
  // https://github.com/chriskempson/tomorrow-theme#tomorrow-night-eighties
  var colors = [
    '#F2777A',
    '#F99157',
    '#FFCC66',
    '#99CC99',
    '#66CCCC',
    '#6699CC',
    '#CC99CC'
  ]

  return function () {
    lastUsed += 1
    return colors[lastUsed % colors.length]
  }
})()

//
// Instance
//

Logdown.prototype._getDecoratedPrefix = function () {
  var decoratedPrefix = []

  if (isColorSupported()) {
    decoratedPrefix.push('%c' + this.opts.prefix + '%c ')
    decoratedPrefix.push(
      'color:' + this.opts.prefixColor + '; font-weight:bold;',
      '' // Empty string resets style.
    )
  } else {
    decoratedPrefix.push('[' + this.opts.prefix + '] ')
  }

  return decoratedPrefix
}

Logdown.prototype._prepareOutput = function (args) {
  var preparedOutput = this._getDecoratedPrefix()
  var parsedMarkdown

  // Only first argument on `console` can have style.
  if (typeof args[0] === 'string') {
    if (this.opts.markdown && isColorSupported()) {
      parsedMarkdown = markdown.parse(args[0])
      preparedOutput[0] = preparedOutput[0] + parsedMarkdown.text
      preparedOutput = preparedOutput.concat(parsedMarkdown.styles)
    } else {
      preparedOutput[0] = preparedOutput[0] + args[0]
    }
  } else {
    preparedOutput.push(args[0])
  }

  if (args.length > 1) {
    preparedOutput = preparedOutput.concat(args.slice(1))
  }

  return preparedOutput
}

module.exports = Logdown
