var path = require('path')

module.exports = {
  entry: './src/browser.js',
  output: {
    libraryTarget: 'umd',
    library: 'logdown',
    path: path.resolve(__dirname, "dist"),
    filename: 'logdown.js'
  }
}
