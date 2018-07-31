/* eslint-env jest */

const logdown = require('../../src/node')

//
// Tests
//

beforeEach(() => {
  logdown._instances = []
  logdown._setPrefixRegExps()
})

it('has a facade for every method on opts.logger', () => {
  const logger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: 'not a function'
  }
  const foo = logdown('foo', { logger: logger })

  expect(typeof foo.log).toBe('function')
  expect(typeof foo.warn).toBe('function')
  expect(typeof foo.error).toBe('undefined')
})

// Issue: https://github.com/caiogondim/logdown.js/issues/95
it('exposes a basic API for `logger` with no iterable methods', () => {
  const logger = {}
  const foo = logdown('foo', { logger: logger })

  expect(typeof foo.log).toBe('function')
  expect(typeof foo.warn).toBe('function')
  expect(typeof foo.error).toBe('function')
  expect(typeof foo.info).toBe('function')
})
