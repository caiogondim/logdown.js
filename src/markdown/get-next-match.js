module.exports = function getNextMatch(text, rules) {
  const matches = []

  rules.forEach(rule => {
    const match = text.match(rule.regexp)

    if (match) {
      matches.push({
        rule: rule,
        match: match,
      })
    }
  })

  if (matches.length === 0) {
    return null
  }

  matches.sort((a, b) => {
    return a.match.index - b.match.index
  })

  return matches[0]
}
