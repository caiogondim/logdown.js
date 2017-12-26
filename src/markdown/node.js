const rules = require('./rules/node')
const getNextMatch = require('./get-next-match')

function parse(text) {
  const styles = []
  let match = getNextMatch(text, rules)

  while (match) {
    text = text.replace(match.rule.regexp, match.rule.replacer)
    match = getNextMatch(text, rules)
  }

  return {
    text: text,
    styles: styles,
  }
}

//
// API
//

module.exports = {
  parse: parse,
}
