/* eslint-env jest */

// Mock localStorage
const globalObject = require('../../src/util/get-global')()
const localStorage = require('../mocks/local-storage')
globalObject.localStorage = localStorage

const logdown = require('../../src/browser')
const abstractDebugBrowser = require('abstract-debug/test/browser')

describe('abstract-debug compatibility', () => {
  it('is compatible with abstract-debug on browser', () => {
    expect(() => abstractDebugBrowser(logdown)).not.toThrow()
  })
})
