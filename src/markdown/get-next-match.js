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
