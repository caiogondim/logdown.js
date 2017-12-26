const chalk = require('chalk')

module.exports = [
  {
    regexp: /\*([^*]+)\*/,
    replacer: function(match, submatch1) {
      return chalk.bold(submatch1)
    },
  },
  {
    regexp: /_([^_]+)_/,
    replacer: function(match, submatch1) {
      return chalk.italic(submatch1)
    },
  },
  {
    regexp: /`([^`]+)`/,
    replacer: function(match, submatch1) {
      return chalk.yellow(submatch1)
    },
  },
]
