/* eslint-env jest */

const logdown = require('../../src/node')

describe('logdown.transports', () => {
  let initialDebug

  beforeEach(() => {
    logdown.transports.length = []

    initialDebug = process.env.NODE_DEBUG
    process.env.NODE_DEBUG = 'foo'
    logdown._setPrefixRegExps()
  })

  afterEach(() => {
    process.env.NODE_DEBUG = initialDebug
    logdown._setPrefixRegExps()
  })

  it('calls each transport function', () => {
    const transport = jest.fn()

    const foo = logdown('foo', { logger: { log: () => {} } })
    logdown.transports = [transport]

    foo.log('bar')

    expect(transport).toBeCalledWith({
      state: { isEnabled: true },
      instance: 'foo',
      level: 'log',
      args: ['bar'],
      msg: '[foo] bar'
    })
  })

  it('calls transports in proper order', () => {
    const transport1 = jest.fn(() => expect(transport2).not.toBeCalled())
    const transport2 = jest.fn()
    const expectedArg = {
      state: { isEnabled: true },
      instance: 'foo',
      level: 'log',
      args: ['bar'],
      msg: '[foo] bar'
    }

    const foo = logdown('foo', { logger: { log: () => {} } })
    logdown.transports = [transport1, transport2]

    foo.log('bar')

    expect(transport1).toBeCalledWith(expectedArg)
    expect(transport2).toBeCalledWith(expectedArg)
  })

  it('allows remove transports at runtime', () => {
    const transport = jest.fn()

    const foo = logdown('foo', { logger: { log: () => {} } })
    logdown.transports = [transport]

    foo.log('bar')

    expect(transport).toBeCalledWith({
      state: { isEnabled: true },
      instance: 'foo',
      level: 'log',
      args: ['bar'],
      msg: '[foo] bar'
    })

    transport.mockReset()
    logdown.transports.pop()

    foo.log('bar')

    expect(transport).not.toBeCalled()
  })

  it('should not include objects into msg', () => {
    const transport = jest.fn()

    const foo = logdown('foo', { logger: { log: () => {} } })
    logdown.transports = [transport]

    foo.log('bar', {quz: 1}, 'baz')

    expect(transport).toBeCalledWith({
      state: { isEnabled: true },
      instance: 'foo',
      level: 'log',
      args: ['bar', {quz: 1}, 'baz'],
      msg: '[foo] bar baz'
    })
  })

  it('should execute transports even if state.isEnabled === false', () => {
    const transport = jest.fn()
    const logger = { log: jest.fn() }

    const foo = logdown('foo', { logger: logger })
    foo.state.isEnabled = false
    logdown.transports = [transport]

    foo.log('bar')

    expect(logger.log).not.toBeCalled()
    expect(transport).toBeCalledWith({
      state: { isEnabled: false },
      instance: 'foo',
      level: 'log',
      args: ['bar'],
      msg: '[foo] bar'
    })
  })
})
