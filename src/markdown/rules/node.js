var ansiColors = require('../../util/ansi-colors')

module.exports = [
  {
    regexp: /\*([^*]+)\*/,
    replacer: function (match, submatch1) {
      return (
        '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
        submatch1 +
        '\u001b[' + ansiColors.modifiers.bold[1] + 'm'
      )
    }
  },
  {
    regexp: /_([^_]+)_/,
    replacer: function (match, submatch1) {
      return (
        '\u001b[' + ansiColors.modifiers.italic[0] + 'm' +
        submatch1 +
        '\u001b[' + ansiColors.modifiers.italic[1] + 'm'
      )
    }
  },
  {
    regexp: /`([^`]+)`/,
    replacer: function (match, submatch1) {
      return (
        '\u001b[' + ansiColors.colors.yellow[0] + 'm' +
        submatch1 +
        '\u001b[' + ansiColors.colors.yellow[1] + 'm'
      )
    }
  }
]
