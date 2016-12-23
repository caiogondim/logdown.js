/* global console, module, window, document, navigator, process */

;(function () {
  'use strict'

  var instances = []
  var lastUsedColorIndex = 0
  // Solarized accent colors http://ethanschoonover.com/solarized
  var colors = [
    '#B58900',
    '#CB4B16',
    '#DC322F',
    '#D33682',
    '#6C71C4',
    '#268BD2',
    '#2AA198',
    '#859900'
  ]
  // Taken from ansi-styles npm module
  // https://github.com/sindresorhus/ansi-styles/blob/master/index.js
  var ansiColors = {
    modifiers: {
      reset: [0, 0],
      bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    colors: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39]
    },
    bgColors: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49]
    }
  }
  var filterRegExps = []

  function Logdown (opts) {
    // Enforces new.
    if (!(this instanceof Logdown)) {
      return new Logdown(opts)
    }

    opts = opts || {}

    var prefix = opts.prefix === undefined ? '' : opts.prefix
    prefix = sanitizeStringToBrowser(prefix)
    if (prefix && isPrefixAlreadyInUse(prefix, instances)) {
      return getInstanceByPrefix(prefix, instances)
    }

    //
    this.alignOutput = Boolean(opts.alignOutput)
    this.markdown = opts.markdown === undefined ? true : opts.markdown
    this.prefix = prefix

    //
    instances.push(this)
    alignPrefixes(instances)

    if (isBrowser()) {
      this.prefixColor = colors[lastUsedColorIndex % colors.length]
      lastUsedColorIndex += 1
    } else if (isNode()) {
      this.prefixColor = getNextPrefixColor()
    }

    return this
  }

  // Static
  // ------

  Logdown.enable = function () {
    Array.prototype.forEach.call(arguments, function (str) {
      if (str[0] === '-') {
        Logdown.disable(str.substr(1))
      }

      var regExp = prepareRegExpForPrefixSearch(str)

      if (str === '*') {
        filterRegExps = []
      } else {
        filterRegExps.push({
          type: 'enable',
          regExp: regExp
        })
      }
    })
  }

  Logdown.disable = function () {
    Array.prototype.forEach.call(arguments, function (str) {
      if (str[0] === '-') {
        Logdown.enable(str.substr(1))
      }

      var regExp = prepareRegExpForPrefixSearch(str)

      if (str === '*') {
        filterRegExps = [{
          type: 'disable',
          regExp: regExp
        }]
      } else {
        filterRegExps.push({
          type: 'disable',
          regExp: regExp
        })
      }
    })
  }

  // Public
  // ------

  var methods = ['debug', 'log', 'info', 'warn', 'error']
  methods.forEach(function (method) {
    Logdown.prototype[method] = function () {
      if (isDisabled(this)) {
        return
      }

      var preparedOutput
      var parsedArgs = []
      var args = Array.prototype.slice.call(arguments, 0)

      if (isBrowser()) {
        preparedOutput = prepareOutputToBrowser(args, this)

        // IE9 workaround
        // http://stackoverflow.com/questions/5538972/
        //  console-log-apply-not-working-in-ie9
        Function.prototype.apply.call(
          console[method] || console.log,
          console,
          preparedOutput
        )
      } else if (isNode()) {
        var text = Array.prototype.slice.call(arguments, 0).join(' ')
        text = sanitizeStringToNode(text)
        preparedOutput = prepareOutputToNode(text, this)

        if (method === 'warn') {
          preparedOutput.parsedText =
            '\u001b[' + ansiColors.colors.yellow[0] + 'm' +
            '⚠' +
            '\u001b[' + ansiColors.colors.yellow[1] + 'm ' +
            preparedOutput.parsedText
        } else if (method === 'error') {
          preparedOutput.parsedText =
            '\u001b[' + ansiColors.colors.red[0] + 'm' +
            '✖' +
            '\u001b[' + ansiColors.colors.red[1] + 'm ' +
            preparedOutput.parsedText
        } else if (method === 'info') {
          preparedOutput.parsedText =
            '\u001b[' + ansiColors.colors.blue[0] + 'm' +
            'ℹ' +
            '\u001b[' + ansiColors.colors.blue[1] + 'm ' +
            preparedOutput.parsedText
        } else if (method === 'debug') {
          preparedOutput.parsedText =
            '\u001b[' + ansiColors.colors.gray[0] + 'm' +
            '🐛' +
            '\u001b[' + ansiColors.colors.gray[1] + 'm ' +
            preparedOutput.parsedText
        }

        //
        parsedArgs.push(preparedOutput.parsedText)
        if (preparedOutput.notText) {
          parsedArgs.push(preparedOutput.notText)
        }

        (console[method] || console.log).apply(
          console,
          parsedArgs
        )
      }
    }
  })

  // Private
  // -------

  function alignPrefixes (instances) {
    var longest = instances.sort(function (a, b) {
      return b.prefix.length - a.prefix.length
    })[0]

    instances.forEach(function (instance) {
      if (instance.alignOutput) {
        var padding = new Array(Math.max(longest.prefix.length - instance.prefix.length + 1, 0)).join(' ')
        instance.prefix = instance.prefix + padding
      }
    })
  }

  function parseMarkdown (text) {
    var styles = []
    var match = getNextMatch(text)

    while (match) {
      text = text.replace(match.rule.regexp, match.rule.replacer)

      if (isBrowser()) {
        styles.push(match.rule.style)
        styles.push('') // Empty string resets style.
      }

      match = getNextMatch(text)
    }

    return {text: text, styles: styles}
  }

  function getNextMatch (text) {
    var matches = []
    var rules = []
    if (isBrowser()) {
      rules = [
        {
          regexp: /\*([^\*]+)\*/,
          replacer: function (match, submatch1) {
            return '%c' + submatch1 + '%c'
          },
          style: 'font-weight:bold;'
        },
        {
          regexp: /_([^_]+)_/,
          replacer: function (match, submatch1) {
            return '%c' + submatch1 + '%c'
          },
          style: 'font-style:italic;'
        },
        {
          regexp: /`([^`]+)`/,
          replacer: function (match, submatch1) {
            return '%c' + submatch1 + '%c'
          },
          style:
            'background:#FDF6E3; ' +
            'color:#586E75; ' +
            'padding:1px 5px; ' +
            'border-radius:4px;'
        }
      ]
    } else if (isNode()) {
      rules = [
        {
          regexp: /\*([^\*]+)\*/,
          replacer: function (match, submatch1) {
            return '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
                   submatch1 +
                   '\u001b[' + ansiColors.modifiers.bold[1] + 'm'
          }
        },
        {
          regexp: /_([^_]+)_/,
          replacer: function (match, submatch1) {
            return '\u001b[' + ansiColors.modifiers.italic[0] + 'm' +
                   submatch1 +
                   '\u001b[' + ansiColors.modifiers.italic[1] + 'm'
          }
        },
        {
          regexp: /`([^`]+)`/,
          replacer: function (match, submatch1) {
            return '\u001b[' + ansiColors.bgColors.bgYellow[0] + 'm' +
                   '\u001b[' + ansiColors.colors.black[0] + 'm' +
                   ' ' + submatch1 + ' ' +
                   '\u001b[' + ansiColors.colors.black[1] + 'm' +
                   '\u001b[' + ansiColors.bgColors.bgYellow[1] + 'm'
          }
        }
      ]
    }

    //
    rules.forEach(function (rule) {
      var match = text.match(rule.regexp)
      if (match) {
        matches.push({
          rule: rule,
          match: match
        })
      }
    })
    if (matches.length === 0) {
      return null
    }

    //
    matches.sort(function (a, b) {
      return a.match.index - b.match.index
    })

    return matches[0]
  }

  function prepareOutputToBrowser (args, instance) {
    var preparedOutput = []
    var parsedMarkdown

    if (instance.prefix) {
      if (isColorSupported()) {
        preparedOutput.push('%c' + instance.prefix + '%c ')
        preparedOutput.push(
          'color:' + instance.prefixColor + '; font-weight:bold;',
          '' // Empty string resets style.
        )
      } else {
        preparedOutput.push('[' + instance.prefix + '] ')
      }
    } else {
      preparedOutput.push('')
    }

    // Only first argument on `console` can have style.
    if (typeof args[0] === 'string') {
      if (instance.markdown && isColorSupported()) {
        parsedMarkdown = parseMarkdown(args[0])
        preparedOutput[0] = preparedOutput[0] + parsedMarkdown.text
        preparedOutput[0] = parsedMarkdown.text
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
    // console.log(preparedOutput)
    return preparedOutput
  }

  function prepareOutputToNode (data, instance) {
    var parsedText = ''
    var notText

    if (instance.prefix) {
      if (isColorSupported()) {
        parsedText =
          '\u001b[' + instance.prefixColor[0] + 'm' +
          '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
          instance.prefix +
          '\u001b[' + ansiColors.modifiers.bold[1] + 'm' +
          '\u001b[' + instance.prefixColor[1] + 'm '
      } else {
        parsedText = '[' + instance.prefix + '] '
      }
    }

    if (typeof data === 'string') {
      if (instance.markdown) {
        parsedText += parseMarkdown(data).text
      } else {
        parsedText += data
      }
    } else {
      notText = data
    }

    return {
      parsedText: parsedText,
      styles: [],
      notText: notText
    }
  }

  function isDisabled (instance) {
    // Parsing `NODE_DEBUG` and `DEBUG` env var.
    // We verify `NODE_DEBUG` and `DEBUG` env vars on runtime so it is
    // easier to test.
    var envVar = null
    if (typeof process !== 'undefined' &&
        process.env !== undefined &&
        filterRegExps.length === 0) {
      // `NODE_DEBUG` has precedence over `DEBUG`
      if (process.env.NODE_DEBUG !== undefined &&
          process.env.NODE_DEBUG !== '') {
        envVar = 'NODE_DEBUG'
      } else if (process.env.DEBUG !== undefined &&
                 process.env.DEBUG !== '') {
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

    // Now checks if instance is disabled
    var isDisabled_ = false
    filterRegExps.forEach(function (filter) {
      if (filter.type === 'enable' && filter.regExp.test(instance.prefix)) {
        isDisabled_ = false
      } else if (filter.type === 'disable' &&
                 filter.regExp.test(instance.prefix)) {
        isDisabled_ = true
      }
    })

    return isDisabled_
  }

  function prepareRegExpForPrefixSearch (str) {
    return new RegExp('^' + str.replace(/\*/g, '.*?') + '$')
  }

  function isPrefixAlreadyInUse (prefix, instances) {
    var isPrefixAlreadyInUse_ = false

    instances.forEach(function (instance) {
      if (instance.prefix === prefix) {
        isPrefixAlreadyInUse_ = true
        return
      }
    })

    return isPrefixAlreadyInUse_
  }

  function getInstanceByPrefix (prefix, instances) {
    var instance

    instances.forEach(function (instanceCur) {
      if (instanceCur.prefix === prefix) {
        instance = instanceCur
        return
      }
    })

    return instance
  }

  function sanitizeStringToBrowser (str) {
    if (typeof str === 'string') {
      return str.replace(/%c/g, '')
    } else {
      return str
    }
  }

  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * Code took from https://github.com/visionmedia/debug/blob/master/browser.js
   */
  function isColorSupported () {
    if (isBrowser()) {
      // Is webkit? http://stackoverflow.com/a/16459606/376773
      var isWebkit = ('WebkitAppearance' in document.documentElement.style)
      // Is firebug? http://stackoverflow.com/a/398120/376773
      var isFirebug = (
        window.console &&
        (console.firebug || (console.exception && console.table))
      )
      // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/
      //  Web_Console#Styling_messages
      var isFirefox31Plus = (
        navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
        parseInt(RegExp.$1, 10) >= 31
      )

      return (isWebkit || isFirebug || isFirefox31Plus)
    } else if (isNode()) {
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
  }

  function isNode () {
    return (
      typeof module !== 'undefined' &&
      typeof module.exports !== 'undefined'
    )
  }

  function isBrowser () {
    return (typeof window !== 'undefined')
  }

  function sanitizeStringToNode (str) {
    return str
  }

  var getNextPrefixColor = (function () {
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
      return nodePrefixColors[(lastUsed += 1) % nodePrefixColors.length]
    }
  })()

  // Export module
  if (isNode()) {
    module.exports = Logdown
  } else if (isBrowser()) {
    window.Logdown = Logdown
  }
}())
