/* eslint-env jest */

// Mock localStorage
const globalObject = require('../../src/util/get-global')()
const localStorage = require('../mocks/local-storage')
globalObject.localStorage = localStorage

const logdown = require('../../src/browser')

describe('localStorage.debug', () => {
  beforeEach(() => {
    console.log = jest.fn()
    logdown._instances = []
  })

  afterEach(() => {
    localStorage.removeItem('debug')
    console.log.mockClear()
  })

  it('`localStorage.debug=foo` enables only instances with “foo” prefix', () => {
    localStorage.debug = 'foo'
    logdown._setPrefixRegExps()

    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    bar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    quz.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    baz.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    expect(console.log).toHaveBeenCalled()
  })

  it('`localStorage.debug=*foo` enables only instances with names ending with “foo”', () => {
    localStorage.debug = '*foo'
    logdown._setPrefixRegExps()

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`localStorage.debug=foo*` enables only instances with names beginning with “foo”', () => {
    localStorage.debug = 'foo*'
    logdown._setPrefixRegExps()

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foobar.log('lorem')
    foo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`localStorage.debug=-*` should disable all instances', () => {
    localStorage.debug = '-*'
    logdown._setPrefixRegExps()

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    foobar.log('lorem')
    foo.log('lorem')
    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('`localStorage.debug=*,-foo` enables all but only instances with “foo” prefix', () => {
    localStorage.debug = '*,-foo'
    logdown._setPrefixRegExps()

    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    quz.log('lorem')
    baz.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(3)
  })

  it('`localStorage.debug=*,-*foo` enables all but instances with names ending with “foo”', () => {
    localStorage.debug = '*,-*foo'
    logdown._setPrefixRegExps()

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`localStorage.debug=*,-foo*` enables all but instances with names beginning with “foo”', () => {
    localStorage.debug = '*,-foo*'
    logdown._setPrefixRegExps()

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    foobar.log('lorem')
    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`localStorage.debug` accepts N arguments', () => {
    localStorage.debug = 'foo,barfoo'
    logdown._setPrefixRegExps()

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })
})
