/* eslint-env jest */

const chalk = require('chalk')
const logdown = require('../../src/node')
const isColorSupported = require('../../src/util/is-color-supported/node')
jest.mock('../../src/util/is-color-supported/node')

describe('prefixColor', () => {
  const origDebug = process.env.NODE_DEBUG
  const origLevel = chalk.level

  beforeEach(() => {
    process.env.NODE_DEBUG = 'foo'
    chalk.level = 1 // ensure chalk will produce the same code on all envs
    logdown._instances = []
    logdown._setPrefixRegExps()

    isColorSupported.mockReturnValue(true)
  })

  afterEach(() => {
    process.env.NODE_DEBUG = origDebug
    chalk.level = origLevel
  })

  it('allows to set named color', () => {
    const logger = {
      log: jest.fn()
    }

    const foo = logdown('foo', {
      logger,
      prefixColor: 'yellow'
    })

    foo.log('hello world')

    expect(logger.log.mock.calls).toMatchSnapshot()
  })

  it('allows to set hex color', () => {
    const logger = {
      log: jest.fn()
    }

    const foo = logdown('foo', {
      logger,
      prefixColor: '#0ff'
    })

    foo.log('hello world')

    expect(logger.log.mock.calls).toMatchSnapshot()
  })

  it('does not applies color if not supported', () => {
    isColorSupported.mockReturnValue(false)

    const logger = {
      log: jest.fn()
    }

    const foo = logdown('foo', {
      logger,
      prefixColor: '#0ff'
    })

    foo.log('hello world')

    expect(logger.log.mock.calls).toMatchSnapshot()
  })
})
