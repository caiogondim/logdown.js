/* eslint-env jest */

const logdown = require('../../src/node')

//
// Tests
//

Object.keys(console).forEach(method => {
  describe(`logdown.${method}`, () => {
    beforeEach(() => {
      console[method] = console[method] || console.log
      console[method] = jest.fn()

      logdown._instances = []
      process.env.NODE_DEBUG = 'foo'
      logdown._setPrefixRegExps()
    })

    afterEach(() => {
      console[method].mockClear()
    })

    it('has a facade for every method on opts.logger', () => {
      const consoleKeys = Object.keys(console)
      const foo = logdown('foo', { logger: console })

      consoleKeys.forEach(consoleMethod => {
        expect(typeof foo[consoleMethod]).toBe('function')
      })
    })
  })
})
