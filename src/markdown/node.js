var rules = require('./rules/node')
var getNextMatch = require('./get-next-match')

function parse (text) {
  var styles = []
  var match = getNextMatch(text, rules)

  while (match) {
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
