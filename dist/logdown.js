(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.logdown = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var toArray = require('./util/to-array')

function Logdown (prefix, opts) {
  if (!(this instanceof Logdown)) {
    return new Logdown(prefix, opts)
  }

  this.opts = Logdown._normalizeOpts(prefix, opts)

  if (Logdown._isPrefixAlreadyInUse(this.opts.prefix)) {
    return Logdown._getInstanceByPrefix(this.opts.prefix)
  }

  Logdown._instances.push(this)
  Logdown._alignPrefixes()
  Logdown._updateEnabledDisabled()

  return this
}

//
// Static
//

Logdown._instances = []
Logdown._filterRegExps = []

Logdown.enable = function () {
  toArray(arguments).forEach(function (str) {
    if (str[0] === '-') {
      Logdown.disable(str.substr(1))
    }

    var regExp = Logdown._prepareRegExpForPrefixSearch(str)

    if (str === '*') {
      Logdown._filterRegExps = []
    } else {
      Logdown._filterRegExps.push({
        type: 'enable',
        regExp: regExp
      })
    }
  })
}

Logdown.disable = function () {
  toArray(arguments).forEach(function (str) {
    if (str[0] === '-') {
      Logdown.enable(str.substr(1))
    }

    var regExp = Logdown._prepareRegExpForPrefixSearch(str)

    if (str === '*') {
      Logdown._filterRegExps = [{
        type: 'disable',
        regExp: regExp
      }]
    } else {
      Logdown._filterRegExps.push({
        type: 'disable',
        regExp: regExp
      })
    }
  })
}

Logdown._prepareRegExpForPrefixSearch = function (str) {
  return new RegExp('^' + str.replace(/\*/g, '.*?') + '$')
}

Logdown._isPrefixAlreadyInUse = function (prefix) {
  return Logdown._instances.some(function (instance) {
    return (instance.opts.prefix === prefix)
  })
}

Logdown._getInstanceByPrefix = function (prefix) {
  var instance

  Logdown._instances.some(function (instanceCur) {
    if (instanceCur.opts.prefix === prefix) {
      instance = instanceCur
      return true
    }
  })

  return instance
}

Logdown._alignPrefixes = function () {
  var longest = Logdown._instances.sort(function (a, b) {
    return b.opts.prefix.length - a.opts.prefix.length
  })[0]

  Logdown._instances
    .filter(function (instance) { return instance.opts.alignOutput })
    .forEach(function (instance) {
      var padding = new Array(Math.max(longest.opts.prefix.length - instance.opts.prefix.length + 1, 0)).join(' ')
      instance.opts.prefix = instance.opts.prefix + padding
    })
}

Logdown._normalizeOpts = function (prefix, opts) {
  if (typeof prefix === 'object') opts = prefix
  opts = opts || {}

  if (typeof prefix !== 'string') prefix = opts.prefix || ''

  var alignOutput = Boolean(opts.alignOutput)
  var markdown = opts.markdown === undefined ? true : Boolean(opts.markdown)
  var prefixColor = Logdown._getNextPrefixColor()

  return {
    prefix: prefix,
    alignOutput: alignOutput,
    markdown: markdown,
    prefixColor: prefixColor
  }
}

//
// Instance
//

var methods = ['debug', 'log', 'info', 'warn', 'error']
methods.forEach(function (method) {
  Logdown.prototype[method] = function () {
    if (this._isDisabled()) {
      return
    }

    var preparedOutput
    var args = toArray(arguments)

    preparedOutput = this._prepareOutput(args, method)
    ;(console[method] || console.log).apply(
      console,
      preparedOutput
    )
  }
}, this)

Logdown.prototype._isDisabled = function () {
  var isDisabled = false
  Logdown._filterRegExps.forEach(function (filter) {
    if (
      filter.type === 'enable' &&
      filter.regExp.test(this.opts.prefix)
    ) {
      isDisabled = false
    } else if (
      filter.type === 'disable' &&
      filter.regExp.test(this.opts.prefix)
    ) {
      isDisabled = true
    }
  }, this)

  return isDisabled
}

module.exports = Logdown

},{"./util/to-array":10}],2:[function(require,module,exports){
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

},{"./base":1,"./markdown/browser":3,"./util/is-color-supported/browser":6,"./util/local-storage":9}],3:[function(require,module,exports){
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
var isWebkit = require('../is-webkit')
var isFirefox = require('../is-firefox')

module.exports = function isColorSupported () {
  return (isWebkit() || isFirefox())
}

},{"../is-firefox":7,"../is-webkit":8}],7:[function(require,module,exports){
module.exports = function isFirefox () {
  return navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)
}

},{}],8:[function(require,module,exports){
// Is webkit? http://stackoverflow.com/a/16459606/376773
module.exports = function isWebkit () {
  return ('WebkitAppearance' in document.documentElement.style)
}

},{}],9:[function(require,module,exports){
module.exports = (window && window.localStorage)

},{}],10:[function(require,module,exports){
module.exports = function toArray (arg) {
  return Array.prototype.slice.call(arg, 0)
}

},{}]},{},[2])(2)
});