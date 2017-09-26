/* eslint-env jest */

const logdown = require('../../src/node')

//
// Tests
//

it('has a facade for every method on opts.logger', () => {
  const logger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: 'not a function'
  };

  const foo = logdown('foo', { logger: logger })

  expect(typeof foo.log).toBe('function');
  expect(typeof foo.warn).toBe('function');
  expect(typeof foo.error).toBe('undefined');
})
