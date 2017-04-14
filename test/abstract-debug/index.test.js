/* eslint-env jest */

const logdown = require('../../src/node')
const abstractDebugNode = require('abstract-debug/test/node')

describe('abstract-debug compatibility', () => {
  it.only('is compatible with abstract-debug on Node.js', () => {
    abstractDebugNode(logdown)
  })
})
