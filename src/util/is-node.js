module.exports = function isNode () {
  return (
    typeof module !== 'undefined' &&
    typeof module.exports !== 'undefined'
  )
}
