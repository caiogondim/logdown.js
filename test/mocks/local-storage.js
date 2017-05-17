const localStorage = {
  setItem (key, value) {
    localStorage[key] = value
  },
  getItem (key) {
    return localStorage[key]
  },
  removeItem (item) {
    localStorage[item] = undefined
  }
}

module.exports = localStorage
