module.exports = function toArray (arg) {
  return Array.prototype.slice.call(arg, 0)
}
