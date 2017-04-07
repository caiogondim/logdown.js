/* eslint-env jest */

const logdown = require('../../src/node')

function createInstances () {
  return [
    logdown('foo'),
    logdown('bar'),
    logdown('quz'),
    logdown('baz')
  ]
}

describe('logdown.enable', () => {
  beforeEach(() => {
    console.log = jest.fn()
    logdown.enable('*')
  })

  afterEach(() => {
    console.log.mockClear()
  })

  it('`(\'*\')` should enable all instances', () => {
    logdown.disable('*')
    logdown.enable('*')
    const instances = createInstances()
    instances.forEach(instance => {
      instance.log('Lorem')
    })

    expect(console.log).toHaveBeenCalled()
  })

  it('`(\'foo\')` should enable only instances with “foo” prefix', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    logdown.disable('*')
    logdown.enable('foo')

    bar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    quz.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    baz.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    expect(console.log).toHaveBeenCalled()
  })

  it('`(\'*foo\')` should enable only instances with names ending with “foo”', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.disable('*')
    logdown.enable('*foo')

    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`(\'foo*\')` should enable only instances with names beginning with “foo”', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.disable('*')
    logdown.enable('foo*')

    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foobar.log('lorem')
    foo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`(\'-*\')` should disable all instances', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.enable('-*')

    foobar.log('lorem')
    foo.log('lorem')
    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('`(\'*\', \'-foo\')` should enable all but only instances with “foo” prefix', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    logdown.enable('*', '-foo')

    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    quz.log('lorem')
    baz.log('lorem')
    expect(console.log).toHaveBeenCalled()
  })

  it('`(\'*\', \'-*foo\')` should enable all but instances with names ending with “foo”', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.enable('*', '-*foo')

    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`(\'*\', \'-foo*\')` should enable all but instances with names beginning with “foo”', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.enable('*', '-foo*')

    foobar.log('lorem')
    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('should accept N arguments', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.disable('*')
    logdown.enable('foo', 'barfoo')

    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })
})
