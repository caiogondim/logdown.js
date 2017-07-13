(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.logdown = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var toArray = require('./util/to-array')

module.exports = function () {
  function Logdown (prefix, opts) {
    if (!(this instanceof Logdown)) {
      return new Logdown(prefix, opts)
    }

    if (Logdown._isPrefixAlreadyInUse(prefix)) {
      return Logdown._getInstanceByPrefix(prefix)
    }

    this.opts = Logdown._normalizeOpts(prefix, opts)
    this.state = Logdown._getInitialState(this.opts)

    Logdown._instances.push(this)

    return this
  }

  //
  // Static
  //

  Logdown._instances = []
  Logdown._prefixRegExps = []

  Logdown._prepareRegExpForPrefixSearch = function (str) {
    return new RegExp('^' + str.replace(/\*/g, '.*?') + '$')
  }

  Logdown._isPrefixAlreadyInUse = function (prefix) {
    return Logdown._instances.some(function (instance) {
      return (instance.opts.prefix === prefix)
    })
  }

  Logdown._getInstanceByPrefix = function (prefix) {
    return Logdown._instances.filter(function (instanceCur) {
      return instanceCur.opts.prefix === prefix
    })[0]
  }

  Logdown._normalizeOpts = function (prefix, opts) {
    if (typeof prefix !== 'string') {
      throw new TypeError('prefix must be a string')
    }

    opts = opts || {}

    var markdown = opts.markdown === undefined ? true : Boolean(opts.markdown)
    var prefixColor = opts.prefixColor || Logdown._getNextPrefixColor()
    var logger = opts.logger || console

    return {
      logger: logger,
      markdown: markdown,
      prefix: prefix,
      prefixColor: prefixColor
    }
  }

  Logdown._getInitialState = function (opts) {
    return {
      isEnabled: Logdown._getEnableState(opts)
    }
  }

  Logdown._getEnableState = function (opts) {
    var isEnabled = false

    Logdown._prefixRegExps.forEach(function (filter) {
      if (
        filter.type === 'enable' &&
        filter.regExp.test(opts.prefix)
      ) {
        isEnabled = true
      } else if (
        filter.type === 'disable' &&
        filter.regExp.test(opts.prefix)
      ) {
        isEnabled = false
      }
    })

    return isEnabled
  }

  //
  // Instance
  //

  var methods = ['debug', 'log', 'info', 'warn', 'error']
  methods.forEach(function (method) {
    Logdown.prototype[method] = function () {
      if (!this.state.isEnabled) {
        return
      }

      var args = toArray(arguments)
      var preparedOutput = this._prepareOutput(args, method)

      ;(this.opts.logger[method] || this.opts.logger.log).apply(
        this.opts.logger,
        preparedOutput
      )
    }
  }, this)

  return Logdown
}

},{"./util/to-array":10}],2:[function(require,module,exports){
var Logdown = require('./base')()
var markdown = require('./markdown/browser')
var isColorSupported = require('./util/is-color-supported/browser')
var globalObject = require('./util/get-global')()

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
  '#CC99CC'
]

Logdown._setPrefixRegExps = function () {
  try {
    if (
      globalObject.localStorage &&
      typeof globalObject.localStorage.getItem('debug') === 'string'
    ) {
      Logdown._prefixRegExps = []

      globalObject.localStorage
        .getItem('debug')
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
  } catch (error) {}
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

//
// API
//

Logdown._setPrefixRegExps()

module.exports = Logdown

},{"./base":1,"./markdown/browser":3,"./util/get-global":6,"./util/is-color-supported/browser":7}],3:[function(require,module,exports){
var rules = require('./rules/browser')
var getNextMatch = require('./get-next-match')

function parse (text) {
  var styles = []
  var match = getNextMatch(text, rules)

  while (match) {
    styles.push(match.rule.style)
    styles.push('') // Empty string resets style.

    text = text.replace(match.rule.regexp, match.rule.replacer)
    match = getNextMatch(text, rules)
  }

  return {
    text: text,
    styles: styles
  }
}

//
// API
//

module.exports = {
  parse: parse
}

},{"./get-next-match":4,"./rules/browser":5}],4:[function(require,module,exports){
module.exports = function getNextMatch (text, rules) {
  var matches = []

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

  matches.sort(function (a, b) {
    return a.match.index - b.match.index
  })

  return matches[0]
}

},{}],5:[function(require,module,exports){
module.exports = [
  {
    regexp: /\*([^*]+)\*/,
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
      'background-color:rgba(255,204,102, 0.1);' +
      'color:#FFCC66;' +
      'padding:2px 5px;' +
      'border-radius:2px;'
  }
]

},{}],6:[function(require,module,exports){
(function (global){
/* eslint-disable no-new-func */
/* global self, global */

module.exports = function getGlobal () {
  // Return the global object based on the environment presently in.
  // window for browser and global for node.
  // Ref from -> https://github.com/purposeindustries/window-or-global/blob/master/lib/index.js
  return (
        (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global) ||
        this
  )
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
var isWebkit = require('../is-webkit')
var isFirefox = require('../is-firefox')

module.exports = function isColorSupported () {
  return (isWebkit() || isFirefox())
}

},{"../is-firefox":8,"../is-webkit":9}],8:[function(require,module,exports){
module.exports = function isFirefox () {
  try {
    return navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)
  } catch (error) {
    return false
  }
}

},{}],9:[function(require,module,exports){
// Is webkit? http://stackoverflow.com/a/16459606/376773
module.exports = function isWebkit () {
  try {
    return ('WebkitAppearance' in document.documentElement.style)
  } catch (error) {
    return false
  }
}

},{}],10:[function(require,module,exports){
module.exports = function toArray (arg) {
  return Array.prototype.slice.call(arg, 0)
}

},{}]},{},[2])(2)
});