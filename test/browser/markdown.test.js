/* eslint-env jest */

jest.mock('../../src/util/is-webkit', () => () => true)
jest.mock('../../src/util/is-color-supported/browser', () => () => true)

// Mock localStorage
const globalObject = require('../../src/util/get-global')()
const localStorage = require('../mocks/local-storage')
globalObject.localStorage = localStorage

const logdown = require('../../src/browser')
let logger

// enable logging
localStorage.setItem('debug', 'foo')
logdown._setPrefixRegExps()

beforeEach(() => {
  logger = logdown('foo')
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
})

it('logs bold', () => {
  logger.log('such *bold*')

  expect(console.log).toHaveBeenCalledWith(
    '%cfoo%c such %cbold%c',
    'color:#F99157; font-weight:bold;',
    '',
    'font-weight:bold;',
    ''
  )
})

it('logs italic', () => {
  logger.log('so _italic_')

  expect(console.log).toHaveBeenCalledWith(
    '%cfoo%c so %citalic%c',
    'color:#F99157; font-weight:bold;',
    '',
    'font-style:italic;',
    ''
  )
})

it('logs code', () => {
  logger.log('very `code`')

  expect(console.log).toHaveBeenCalledWith(
    '%cfoo%c very %ccode%c',
    'color:#F99157; font-weight:bold;',
    '',
    'background-color:rgba(255,204,102, 0.1);color:#FFCC66;padding:2px 5px;border-radius:2px;',
    ''
  )
})

xit('logs bold, italic and code', () => { // currently seems to not work
  logger.log('such `code` with very _italic_ and so *bold* and *_wow_ nested*')
})
