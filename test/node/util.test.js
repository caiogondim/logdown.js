/* eslint-env jest */

const isColorSupported = require('../../src/util/is-color-supported/node')

const origEnv = process.env
const origPlatform = process.platform
const origStdout = process.stdout

beforeEach(() => {
  process.env = {}
  process.platform = 'jest'
  delete process.stdout
})

afterEach(() => {
  process.env = origEnv
  process.stdout = origStdout
  process.platform = origPlatform
})

it('should return false if no color support', () => {
  expect(isColorSupported()).toBe(false)
})

it('should not allow color for dumb TERM', () => {
  process.env.TERM = 'dumb'
  expect(isColorSupported()).toBe(false)
})

it('should not allow outside TTY', () => {
  process.stdout = {
    isTTY: false
  }

  expect(isColorSupported()).toBe(false)
})

it('should allow colors for win32', () => {
  process.platform = 'win32'
  expect(isColorSupported()).toBe(true)
})

it('should allow colors for COLORTERM', () => {
  process.env.COLORTERM = true
  expect(isColorSupported()).toBe(true)
})

it('should allow colors for linux like terminals', () => {
  [
    'screen',
    'xterm',
    'vt100',
    'color',
    'ansi',
    'cygwin',
    'linux'
  ].forEach((term) => {
    process.env.TERM = term

    expect(isColorSupported()).toBe(true)
  })
})
