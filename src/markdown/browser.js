var Markdown = require('./Markdown')

var styles = []

function createStyledRenderer (style) {
  return function (input) {
    styles.push(style)
    styles.push('') // Empty string resets style.

    return '%c' + input + '%c'
  }
}

var markdown = new Markdown({
  renderer: {
    '*': createStyledRenderer('font-weight:bold;'),
    '_': createStyledRenderer('font-style:italic;'),
    '`': createStyledRenderer(
      'background-color:rgba(255,204,102, 0.1);' +
      'color:#FFCC66;' +
      'padding:2px 5px;' +
      'border-radius:2px;'
    )
  }
})

function parse (text) {
  var result = {
    text: markdown.parse(text),
    styles: [].concat(styles)
  }

  styles.length = 0

  return result
}

module.exports = {
  parse: parse
}
