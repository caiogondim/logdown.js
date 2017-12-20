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
    opts = opts || {}

    if (typeof prefix === 'object') {
      var originalPrefixVal = prefix
      prefix = prefix.prefix
      opts = originalPrefixVal
    } else if (typeof prefix === 'string') {
      opts.prefix = prefix
    }

    if (typeof opts.prefix !== 'string') {
      throw new TypeError('prefix must be a string')
    }

    opts.markdown = opts.markdown === undefined ? true : Boolean(opts.markdown)
    opts.prefixColor = opts.prefixColor || Logdown._getNextPrefixColor()
    opts.logger = opts.logger || console

    return opts
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
