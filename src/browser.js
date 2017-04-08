var Logdown = require('./base')
var markdown = require('./markdown/browser')
var isColorSupported = require('./util/is-color-supported/browser')
var localStorage = require('./util/local-storage')

//
// Static
//

Logdown._updateEnabledDisabled = function () {
  if (
    localStorage &&
    typeof localStorage.getItem('debug') === 'string'
  ) {
    Logdown.disable('*')
    localStorage
      .getItem('debug')
      .split(',')
      .forEach(function (regExp) {
        Logdown.enable(regExp)
      })
  }
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

Logdown.prototype._prepareOutput = function (args, instance) {
  var preparedOutput = []
  var parsedMarkdown

  if (this.opts.prefix) {
    if (isColorSupported()) {
      preparedOutput.push('%c' + this.opts.prefix + '%c ')
      preparedOutput.push(
        'color:' + this.opts.prefixColor + '; font-weight:bold;',
        '' // Empty string resets style.
      )
    } else {
      preparedOutput.push('[' + this.prefix + '] ')
    }
  } else {
    preparedOutput.push('')
  }

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
    preparedOutput[0] = args[0]
  }

  if (args.length > 1) {
    preparedOutput = preparedOutput.concat(args.splice(1))
  }

  return preparedOutput
}

//
// API
//

module.exports = Logdown
