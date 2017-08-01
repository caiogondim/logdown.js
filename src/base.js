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

    Logdown._decorateLoggerMethods(this)
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

  Logdown._decorateLoggerMethods = function (instance) {
    Object.keys(instance.opts.logger).forEach(function (method) {
      instance[method] = function () {
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
    })
  }

  return Logdown
}
