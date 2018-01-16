var chalk = require('chalk')
var Markdown = require('./Markdown')

var markdown = new Markdown({
  renderer: {
    '*': chalk.bold.bind(chalk),
    '_': chalk.italic.bind(chalk),
    '`': chalk.yellow.bind(chalk)
  }
})

function parse (text) {
  return {
    text: markdown.parse(text),
    styles: []
  }
}

module.exports = {
  parse: parse
}
