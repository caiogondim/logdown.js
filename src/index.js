var Logdown = (function() {
  'use strict'

  var instances = []
  var lastUsedColorIndex
  var nextColorIndex
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
  var disabledInstancesRegExps = []
  var enabledInstancesRegExps = [] // RegExp that matches nothing

  function Logdown(opts) {
    // enforces new
    if (!(this instanceof Logdown)) {
      return new Logdown(opts)
    }

    //
    opts = opts || {}
    this.markdown = opts.markdown || true
    this.prefix = opts.prefix || ''

    //
    instances.push(this)

    nextColorIndex = getNextColorIndex(lastUsedColorIndex, colors)
    this.prefixColor = colors[nextColorIndex]
    lastUsedColorIndex = nextColorIndex

    return this
  }

  // Static
  // ------

  Logdown.enable = function(str) {
    var regExp = prepareRegExpForPrefixSearch(str)
    enabledInstancesRegExps.push(regExp)
  }

  Logdown.disable = function(str) {
    var regExp = prepareRegExpForPrefixSearch(str)
    disabledInstancesRegExps.push(regExp)
  }

  // Public
  // ------

  Logdown.prototype.log = function(text) {
    var preparedOutput

    if (isDisabled(this)) {
      return
    }

    preparedOutput = prepareOutput(text, this)

    console.log.apply(
      console,
      [preparedOutput.parsedText].concat(preparedOutput.styles)
    )
  }

  Logdown.prototype.info = function(text) {
    var preparedOutput

    if (isDisabled(this)) {
      return
    }

    preparedOutput = prepareOutput(text, this)

    console.info.apply(
      console,
      [preparedOutput.parsedText].concat(preparedOutput.styles)
    )
  }

  Logdown.prototype.error = function(text) {
    var preparedOutput

    if (isDisabled(this)) {
      return
    }

    preparedOutput = prepareOutput(text, this)

    console.error.apply(
      console,
      [preparedOutput.parsedText].concat(preparedOutput.styles)
    )
  }

  Logdown.prototype.warn = function(text) {
    var preparedOutput

    if (isDisabled(this)) {
      return
    }

    preparedOutput = prepareOutput(text, this)

    console.warn.apply(
      console,
      [preparedOutput.parsedText].concat(preparedOutput.styles)
    )
  }

  // Private
  // -------

  function parseMarkdown(text) {
    var styles = []
    var match = getNextMatch(text)

    while (match) {
      text = text.replace(match.rule.regexp, match.rule.replacer)
      styles.push(match.rule.style)
      styles.push('')

      match = getNextMatch(text)
    }

    return {text: text, styles: styles}
  }

  function getNextMatch(text) {
    var matches = []
    var rules = [
      {
        regexp: /\*([^\*]+)\*/,
        replacer: function(match, submatch1) {
          return '%c' + submatch1 + '%c'
        },
        style: 'font-weight: bold;'
      },
      {
        regexp: /\_([^\_]+)\_/,
        replacer: function(match, submatch1) {
          return '%c' + submatch1 + '%c'
        },
        style: 'font-style: italic;'
      },
      {
        regexp: /\`([^\`]+)\`/,
        replacer: function(match, submatch1) {
          return "%c" + submatch1 + "%c";
        },
        style:
          'background: #FDF6E3;' +
          'color: #586E75;' +
          'padding: 1px 5px;' +
          'border-radius: 4px;'
      }
    ]

    //
    rules.forEach(function(rule) {
      var match = text.match(rule.regexp)
      if (match) {
        matches.push({
          rule: rule,
          match: match
        })
      }
    })
    if (matches.length === 0) {
      return null;
    }

    //
    // matches.sort(function(a, b) {
    //   return a.match.index - b.match.index
    // })

    return matches[0]
  }

  function prepareOutput(text, instance) {
    var parsedMarkdown
    var parsedText
    var styles

    if (instance.markdown) {
      parsedMarkdown = parseMarkdown(text)
      parsedText = parsedMarkdown.text
      styles = parsedMarkdown.styles
    }

    parsedText = parsedText || text
    styles = styles || []

    if (instance.prefix) {
      parsedText = '%c' + instance.prefix + '%c ' + parsedText
      styles.unshift('color:' + instance.prefixColor + '; font-weight:bold;', '')
    }

    return {
      parsedText: parsedText,
      styles: styles
    }
  }

  function isDisabled(instance) {
    var isDisabled = false
    var isEnabled = false

    disabledInstancesRegExps.forEach(function(regExp) {
      if (regExp.test(instance.prefix)) {
        isDisabled = true
        return
      }
    })

    enabledInstancesRegExps.forEach(function(regExp) {
      if (regExp.test(instance.prefix)) {
        isEnabled = true
        return
      }
    })

    return (isDisabled && !isEnabled)
  }

  function prepareRegExpForPrefixSearch(str) {
    var regExpStr = str.replace(/\*/g, '.*?')
    var regExp = new RegExp(regExpStr)

    return regExp
  }

  function getNextColorIndex(lastUsedColorIndex, colors) {
    if (lastUsedColorIndex === undefined) {
      return 0
    }

    if (lastUsedColorIndex + 1 >= colors.length) {
      return 0
    } else {
      return lastUsedColorIndex + 1
    }
  }

  return Logdown

}())
