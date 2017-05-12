/* eslint-env jest */

const logdown = require('../../src/browser')
const abstractDebugBrowser = require('abstract-debug/test/browser')

describe('abstract-debug compatibility', () => {
  it('is compatible with abstract-debug on browser', () => {
    expect(() => abstractDebugBrowser(logdown)).not.toThrow()
  })
})
