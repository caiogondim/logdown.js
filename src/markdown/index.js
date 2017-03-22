var isBrowser = require('../util/is-browser')

var rules
if (isBrowser()) {
  rules = require('./rules/browser')
} else {
  rules = require('./rules/node')
}

function parse (text) {
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

  return {
    text: text,
    styles: styles
  }
}

function getNextMatch (text) {
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

//
// API
//

module.exports = {
  parse: parse
}
