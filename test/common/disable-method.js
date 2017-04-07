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

describe('logdown.disable', () => {
  beforeEach(() => {
    console.log = jest.fn()
    logdown.enable('*')
  })

  afterEach(() => {
    console.log.mockClear()
  })

  it('`(\'*\')` should disable all instances', () => {
    logdown.enable('*')
    logdown.disable('*')
    const instances = createInstances()
    instances.forEach(function (instance) {
      instance.log('Lorem')
    })

    expect(console.log).not.toHaveBeenCalled()
  })

  it('`(\'foo\')` should disable only instances with “foo” prefix', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    logdown.enable('*')
    logdown.disable('foo')

    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    quz.log('lorem')
    baz.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(3)
  })

  it('`(\'*foo\')` should disable only instances with names ending with “foo”', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.enable('*')
    logdown.disable('*foo')

    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`(\'foo*\')` should disable only instances with names beginning with “foo”', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.enable('*')
    logdown.disable('foo*')

    foobar.log('lorem')
    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`(\'*\')` should disable all instances', () => {
    logdown.enable('*')
    logdown.disable('*')
    const instances = createInstances()
    instances.forEach(function (instance) {
      instance.log('Lorem')
    })

    expect(console.log).not.toHaveBeenCalled()
  })

  it('`(\'foo\')` should disable only instances with “foo” prefix', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    logdown.enable('*')
    logdown.disable('foo')

    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    quz.log('lorem')
    baz.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(3)
  })

  it('`(\'*\', \'-*foo\')` should disable all but instances with names ending with “foo”', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.disable('*', '-*foo')

    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`(\'*\', \'-foo*\')` should disable all but instances with names beginning with “foo”', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.disable('*', '-foo*')

    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foobar.log('lorem')
    foo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`(\'-*\')` should not disable any instances', () => {
    logdown.disable('-*')
    const instances = createInstances()
    instances.forEach(function (instance) {
      instance.log('Lorem')
    })
    expect(console.log).toHaveBeenCalledTimes(4)
  })

  it('`(\'*\', \'-foo\')` should disable all but instances with “foo” prefix', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    logdown.disable('*', '-foo')

    bar.log('lorem')
    quz.log('lorem')
    baz.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  it('should accept N arguments', () => {
    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    logdown.enable('*')
    logdown.disable('foo', 'barfoo')

    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })
})
