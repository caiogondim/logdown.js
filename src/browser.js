const Logdown = require('./base')()
const markdown = require('./markdown/browser')
const isColorSupported = require('./util/is-color-supported/browser')
const globalObject = require('./util/get-global')()

//
// Static
//

// Tomorrow Night Eighties colors
// https://github.com/chriskempson/tomorrow-theme#tomorrow-night-eighties
Logdown.prefixColors = [
  '#F2777A',
  '#F99157',
  '#FFCC66',
  '#99CC99',
  '#66CCCC',
  '#6699CC',
  '#CC99CC',
]

Logdown._setPrefixRegExps = function() {
  try {
    if (
      globalObject.localStorage &&
      typeof globalObject.localStorage.getItem('debug') === 'string'
    ) {
      Logdown._prefixRegExps = []

      globalObject.localStorage
        .getItem('debug')
        .split(',')
        .forEach(str => {
          str = str.trim()
          let type = 'enable'

          if (str[0] === '-') {
            str = str.substr(1)
            type = 'disable'
          }

          const regExp = Logdown._prepareRegExpForPrefixSearch(str)

          Logdown._prefixRegExps.push({
            type: type,
            regExp: regExp,
          })
        })
    }
  } catch (error) {}
}

Logdown._getNextPrefixColor = (function() {
  let lastUsed = 0

  return function() {
    lastUsed += 1
    return Logdown.prefixColors[lastUsed % Logdown.prefixColors.length]
  }
})()

//
// Instance
//

Logdown.prototype._getDecoratedPrefix = function() {
  const decoratedPrefix = []

  if (isColorSupported()) {
    decoratedPrefix.push('%c' + this.opts.prefix + '%c ')
    decoratedPrefix.push(
      'color:' + this.opts.prefixColor + '; font-weight:bold;',
      '', // Empty string resets style.
    )
  } else {
    decoratedPrefix.push('[' + this.opts.prefix + '] ')
  }

  return decoratedPrefix
}

Logdown.prototype._prepareOutput = function(args) {
  let preparedOutput = this._getDecoratedPrefix()
  let parsedMarkdown

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

//
// API
//

Logdown._setPrefixRegExps()

module.exports = Logdown
