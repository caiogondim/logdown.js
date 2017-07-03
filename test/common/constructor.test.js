/* eslint-env jest */

const logdown = require('../../src/node')

describe('logdown()', () => {
  beforeEach(() => {
    logdown._instances = []
  })

  it('returns an existing instance if the prefix is already in use', () => {
    const foo = logdown('foo')
    const foo2 = logdown('foo')
    expect(foo).toEqual(foo2)
  })

  it('gives a new prefix color for each instance', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    expect(foo.opts.prefixColor).not.toEqual(bar.opts.prefixColor)
    expect(foo.opts.prefixColor).not.toEqual(quz.opts.prefixColor)
    expect(foo.opts.prefixColor).not.toEqual(baz.opts.prefixColor)
  })

  it('sets prefix if string is passed as only argument', () => {
    const log1 = logdown('foo')
    expect(log1.opts.prefix).toEqual('foo')
  })

  it('accepts custom prefixColor', () => {
    const prefixColor = '#FF0000'
    const log1 = logdown('foo', { prefixColor })
    expect(log1.opts.prefixColor).toEqual(prefixColor)
  })
})
