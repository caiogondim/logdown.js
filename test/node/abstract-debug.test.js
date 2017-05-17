/* eslint-env jest */

const logdown = require('../../src/node')
const abstractDebugNode = require('abstract-debug/test/node')

describe('abstract-debug compatibility', () => {
  it('is compatible with abstract-debug on Node.js', () => {
    expect(() => abstractDebugNode(logdown)).not.toThrow()
  })
})
