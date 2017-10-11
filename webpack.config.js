var path = require('path')

module.exports = {
  entry: './src/browser.js',
  output: {
    libraryTarget: 'window',
    library: 'logdown',
    path: path.resolve(__dirname, "dist"),
    filename: 'logdown.js'
  }
}
