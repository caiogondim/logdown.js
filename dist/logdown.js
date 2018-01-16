(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["logdown"] = factory();
	else
		root["logdown"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Logdown = __webpack_require__(1)()
var markdown = __webpack_require__(3)
var isColorSupported = __webpack_require__(5)
var globalObject = __webpack_require__(8)()

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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var toArray = __webpack_require__(2)

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

    Logdown._decorateLoggerMethods(this)
    Logdown._instances.push(this)

    return this
  }

  //
  // Static
  //

  Logdown.transports = []
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

  Logdown._decorateLoggerMethods = function (instance) {
    var logger = instance.opts.logger

    var loggerMethods = Object
      .keys(logger)
      .filter(function (method) { return typeof logger[method] === 'function' })

    // In old Safari and Chrome browsers, `console` methods are not iterable.
    // In that case, we provide a minimum API.
    if (loggerMethods.length === 0) {
      loggerMethods = ['log', 'warn', 'error']
    }

    loggerMethods
      .forEach(function (method) {
        instance[method] = function () {
          var args = toArray(arguments)
          var instance = this.opts.prefix

          if (Logdown.transports.length) {
            var msg = '[' + instance + '] ' +
              args
                .filter(function (arg) { return typeof arg !== 'object' })
                .join(' ')

            Logdown.transports.forEach(function (transport) {
              transport({
                state: this.state,
                instance: instance,
                level: method,
                args: args,
                msg: msg
              })
            }.bind(this))
          }

          if (this.state.isEnabled) {
            var preparedOutput = this._prepareOutput(args, method)
            logger[method].apply(logger, preparedOutput)
          }
        }
      })
  }

  return Logdown
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function toArray (arg) {
  return Array.prototype.slice.call(arg, 0)
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var Markdown = __webpack_require__(4)

var styles = []

function createStyledRenderer (style) {
  return function (input) {
    styles.push(style)
    styles.push('') // Empty string resets style.

    return '%c' + input + '%c'
  }
}

var markdown = new Markdown({
  renderer: {
    '*': createStyledRenderer('font-weight:bold;'),
    '_': createStyledRenderer('font-style:italic;'),
    '`': createStyledRenderer(
      'background-color:rgba(255,204,102, 0.1);' +
      'color:#FFCC66;' +
      'padding:2px 5px;' +
      'border-radius:2px;'
    )
  }
})

function parse (text) {
  var result = {
    text: markdown.parse(text),
    styles: [].concat(styles)
  }

  styles.length = 0

  return result
}

module.exports = {
  parse: parse
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var lexemeRe = /([_*`\\]|[^_*`\\]+)/g
var mdTagRe = /[_*`]/

function Markdown (options) {
  this.renderer = options.renderer
}

function isMdTag (lexeme) {
  return mdTagRe.test(lexeme)
}

Markdown.prototype.parse = function (text) {
  var lexemes = text.match(lexemeRe)
  var render = this.renderer

  var formattedText = ''
  var currentScope
  var scopesStack = []
  var activeScopes = {}
  var buffer
  var lexeme
  var cursor = 0

  function drainTillLexeme (lexeme) {
    var buffer = ''

    while (currentScope && currentScope.tag !== lexeme) {
      buffer = currentScope.tag + currentScope.text + buffer
      activeScopes[currentScope.tag] = false
      currentScope = scopesStack.pop()
    }

    return buffer
  }

  while (lexeme = lexemes[cursor]) { // eslint-disable-line
    buffer = ''
    cursor++

    if (isMdTag(lexeme)) {
      if (activeScopes[lexeme]) {
        // we've found matching closing tag
        // if we have some other unclosed tags in-between - treat them as a plain text
        buffer = drainTillLexeme(lexeme)

        // now currentScope holds the scope for the tag (`lexeme`) we are trying to close
        buffer = render[currentScope.tag](currentScope.text + buffer)
        activeScopes[lexeme] = false
        currentScope = scopesStack.pop()
      } else {
        var initialText = ''

        if (lexeme === '`') {
          // `code` according to spec has the highest priority
          // and does not allow nesting
          // looking if we can find the closing delimiter

          // NOTE: we have already incremented cursor, so we do not need to add 1
          var newCursor = lexemes.indexOf(lexeme, cursor)

          if (newCursor !== -1) {
            formattedText += drainTillLexeme() // if we already have activeScopes, treat them as plain text
            initialText = lexemes.slice(cursor, newCursor).join('')
            cursor = newCursor // set cursor to the closing backticks
          }
        }

        if (currentScope) {
          scopesStack.push(currentScope)
        }

        activeScopes[lexeme] = true
        currentScope = {
          tag: lexeme,
          text: initialText
        }
      }
    } else {
      buffer = lexeme

      if (lexeme === '\\') { // process escaping
        var nextLexeme = lexemes[cursor]

        if (isMdTag(nextLexeme) || nextLexeme === '\\') {
          // ignore next md tag, because it is escaped
          buffer = nextLexeme
          cursor++
        }
      }
    }

    if (buffer) {
      if (currentScope) {
        currentScope.text += buffer
      } else {
        formattedText += buffer
      }

      buffer = ''
    }
  }

  // get the rest of the unclosed tags
  formattedText += drainTillLexeme()

  return formattedText
}

module.exports = Markdown


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var isWebkit = __webpack_require__(6)
var isFirefox = __webpack_require__(7)

module.exports = function isColorSupported () {
  return (isWebkit() || isFirefox())
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// Is webkit? http://stackoverflow.com/a/16459606/376773
module.exports = function isWebkit () {
  try {
    return ('WebkitAppearance' in document.documentElement.style) && !/Edge/.test(navigator.userAgent)
  } catch (error) {
    return false
  }
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function isFirefox () {
  try {
    return /firefox\/(\d+)/i.test(navigator.userAgent)
  } catch (error) {
    return false
  }
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/* eslint-disable no-new-func */
/* global self, global */

function getGlobal (slf, glb) {
  // Return the global object based on the environment presently in.
  // window for browser and global for node.
  // Ref from -> https://github.com/purposeindustries/window-or-global/blob/master/lib/index.js
  return (
        (typeof slf === 'object' && slf.self === slf && slf) ||
        (typeof glb === 'object' && glb.global === glb && glb) ||
        this
  )
}

module.exports = getGlobal.bind(this, self, global)
module.exports.getGlobal = getGlobal

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
});