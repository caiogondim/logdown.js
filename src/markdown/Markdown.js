var lexemeRe = /([_*`\\]|[^_*`\\]+)/g
var mdTagRe = /[_*`]/

function Markdown (options) {
  this.renderer = options.renderer
}

function isMdTag (lexeme) {
  return mdTagRe.test(lexeme)
}

Markdown.prototype.parse = function (text) {
  var lexemes = text.match(lexemeRe)
  var render = this.renderer

  var formattedText = ''
  var currentScope
  var scopesStack = []
  var activeScopes = {}
  var buffer
  var lexeme
  var cursor = 0

  function drainTillLexeme (lexeme) {
    var buffer = ''

    while (currentScope && currentScope.tag !== lexeme) {
      buffer = currentScope.tag + currentScope.text + buffer
      activeScopes[currentScope.tag] = false
      currentScope = scopesStack.pop()
    }

    return buffer
  }

  while (lexeme = lexemes[cursor]) { // eslint-disable-line
    buffer = ''
    cursor++

    if (isMdTag(lexeme)) {
      if (activeScopes[lexeme]) {
        // we've found matching closing tag
        // if we have some other unclosed tags in-between - treat them as a plain text
        buffer = drainTillLexeme(lexeme)

        // now currentScope holds the scope for the tag (`lexeme`) we are trying to close
        buffer = render[currentScope.tag](currentScope.text + buffer)
        activeScopes[lexeme] = false
        currentScope = scopesStack.pop()
      } else {
        var initialText = ''

        if (lexeme === '`') {
          // `code` according to spec has the highest priority
          // and does not allow nesting
          // looking if we can find the closing delimiter

          // NOTE: we have already incremented cursor, so we do not need to add 1
          var newCursor = lexemes.indexOf(lexeme, cursor)

          if (newCursor !== -1) {
            formattedText += drainTillLexeme() // if we already have activeScopes, treat them as plain text
            initialText = lexemes.slice(cursor, newCursor).join('')
            cursor = newCursor // set cursor to the closing backticks
          }
        }

        if (currentScope) {
          scopesStack.push(currentScope)
        }

        activeScopes[lexeme] = true
        currentScope = {
          tag: lexeme,
          text: initialText
        }
      }
    } else {
      buffer = lexeme

      if (lexeme === '\\') { // process escaping
        var nextLexeme = lexemes[cursor]

        if (isMdTag(nextLexeme) || nextLexeme === '\\') {
          // ignore next md tag, because it is escaped
          buffer = nextLexeme
          cursor++
        }
      }
    }

    if (buffer) {
      if (currentScope) {
        currentScope.text += buffer
      } else {
        formattedText += buffer
      }

      buffer = ''
    }
  }

  // get the rest of the unclosed tags
  formattedText += drainTillLexeme()

  return formattedText
}

module.exports = Markdown
