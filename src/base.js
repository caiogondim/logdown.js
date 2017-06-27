var toArray = require('./util/to-array')

module.exports = function () {
  function Logdown (prefix, opts) {
    if (!(this instanceof Logdown)) {
      return new Logdown(prefix, opts)
    }

    this.opts = Logdown._normalizeOpts(prefix, opts)

    if (Logdown._isPrefixAlreadyInUse(this.opts.prefix)) {
      return Logdown._getInstanceByPrefix(this.opts.prefix)
    }

    Logdown._instances.push(this)
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

  Logdown._normalizeOpts = function (prefix, opts) {
    if (typeof prefix !== 'string') {
      throw new TypeError('prefix must be a string')
    }

    opts = opts || {}

    var markdown = opts.markdown === undefined ? true : Boolean(opts.markdown)
    var prefixColor = Logdown._getNextPrefixColor()

    return {
      prefix: prefix,
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

      var args = toArray(arguments)
      var preparedOutput = this._prepareOutput(args, method)

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

  return Logdown
}
