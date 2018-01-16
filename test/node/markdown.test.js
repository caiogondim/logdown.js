/* eslint-env jest */

const chalk = require('chalk')
const logdown = require('../../src/node')

const origDebug = process.env.NODE_DEBUG
let logger

beforeEach(() => {
  // enable logging
  process.env.NODE_DEBUG = 'foo'
  logdown._setPrefixRegExps()

  logger = logdown('foo')
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
  process.env.NODE_DEBUG = origDebug
})

it('logs bold', () => {
  logger.log('such *bold*')

  expect(console.log).toHaveBeenCalledWith(
    logger._getDecoratedPrefix('log'),
    'such ' + chalk.bold('bold')
  )
})

it('logs italic', () => {
  logger.log('so _italic_')

  expect(console.log).toHaveBeenCalledWith(
    logger._getDecoratedPrefix('log'),
    'so ' + chalk.italic('italic')
  )
})

it('logs code', () => {
  logger.log('very `code`')

  expect(console.log).toHaveBeenCalledWith(
    logger._getDecoratedPrefix('log'),
    'very ' + chalk.yellow('code')
  )
})

it('logs bold, italic and code', () => {
  logger.log('such `code` with very _italic_ and so *bold* and *_wow_ nested*')

  expect(console.log).toHaveBeenCalledWith(
    logger._getDecoratedPrefix('log'),
    `such ${chalk.yellow('code')} with very ${chalk.italic('italic')} and so ${chalk.bold('bold')} and ${chalk.bold(`${chalk.italic('wow')} nested`)}`
  )
})
