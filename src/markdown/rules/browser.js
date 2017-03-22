module.exports = [
  {
    regexp: /\*([^*]+)\*/,
    replacer: function (match, submatch1) {
      return '%c' + submatch1 + '%c'
    },
    style: 'font-weight:bold;'
  },
  {
    regexp: /_([^_]+)_/,
    replacer: function (match, submatch1) {
      return '%c' + submatch1 + '%c'
    },
    style: 'font-style:italic;'
  },
  {
    regexp: /`([^`]+)`/,
    replacer: function (match, submatch1) {
      return '%c' + submatch1 + '%c'
    },
    style:
      'background-color:rgba(255,204,102, 0.1);' +
      'color:#FFCC66;' +
      'padding:2px 5px;' +
      'border-radius:2px;'
  }
]
