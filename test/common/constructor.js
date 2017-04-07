/* eslint-env jest */

const logdown = require('../../src/node')

describe('logdown()', () => {
  it('should return an existing instance if the prefix is already in use', () => {
    const foo = logdown('foo')
    const foo2 = logdown('foo')
    expect(foo).toEqual(foo2)
  })

  it('should give a new prefix color for each instance', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    expect(foo.opts.prefixColor).not.toEqual(bar.opts.prefixColor)
    expect(foo.opts.prefixColor).not.toEqual(quz.opts.prefixColor)
    expect(foo.opts.prefixColor).not.toEqual(baz.opts.prefixColor)
  })

  // For compatibiltiy with debug
  it('should set prefix if string is passed as only argument', () => {
    const log1 = logdown('foo')
    expect(log1.opts.prefix).toEqual('foo')
  })
})
