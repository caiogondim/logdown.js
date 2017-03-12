/* global describe, afterEach, beforeEach, console, it, require, window, Logdown, chai, sinon, localStorage */

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

describe('localStorage.debug', function () {
  var sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    sandbox.stub(window.console, 'log')

    Logdown.enable('*')
    Logdown._instances = []
  })

  afterEach(function () {
    localStorage.removeItem('debug')
    sandbox.restore()
  })

  it('`localStorage.debug=foo` should enable only instances with “foo” prefix', function () {
    try {
      localStorage.debug = 'foo'

      var foo = Logdown('foo')
      var bar = Logdown('bar')
      var quz = Logdown('quz')
      var baz = Logdown('baz')

      bar.log('lorem')
      assert.notCalled(console.log)
      quz.log('lorem')
      assert.notCalled(console.log)
      baz.log('lorem')
      assert.notCalled(console.log)
      foo.log('lorem')
      assert.called(console.log)

      sandbox.restore()
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`localStorage.debug=*foo` should enable only instances with names ending with “foo”', function () {
    try {
      localStorage.debug = '*foo'

      var foo = Logdown('foo')
      var bar = Logdown('bar')
      var foobar = Logdown('foobar')
      var barfoo = Logdown('barfoo')

      bar.log('lorem')
      foobar.log('lorem')
      assert.notCalled(console.log)
      foo.log('lorem')
      barfoo.log('lorem')
      assert.calledTwice(console.log)

      sandbox.restore()
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`localStorage.debug=foo*` should enable only instances with names beginning with “foo”', function () {
    try {
      localStorage.debug = 'foo*'

      var foo = Logdown('foo')
      var bar = Logdown('bar')
      var foobar = Logdown('foobar')
      var barfoo = Logdown('barfoo')

      bar.log('lorem')
      barfoo.log('lorem')
      assert.notCalled(console.log)
      foobar.log('lorem')
      foo.log('lorem')
      assert.calledTwice(console.log)

      sandbox.restore()
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`localStorage.debug=-*` should disable all instances', function () {
    try {
      localStorage.debug = '-*'

      var foo = Logdown('foo')
      var bar = Logdown('bar')
      var foobar = Logdown('foobar')
      var barfoo = Logdown('barfoo')

      foobar.log('lorem')
      foo.log('lorem')
      bar.log('lorem')
      barfoo.log('lorem')
      assert.notCalled(console.log)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`localStorage.debug=*,-foo` should enable all but only instances with “foo” prefix', function () {
    try {
      localStorage.debug = '*,-foo'

      var foo = Logdown('foo')
      var bar = Logdown('bar')
      var quz = Logdown('quz')
      var baz = Logdown('baz')

      foo.log('lorem')
      assert.notCalled(console.log)
      bar.log('lorem')
      quz.log('lorem')
      baz.log('lorem')
      assert.calledThrice(console.log)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`localStorage.debug=*,-*foo` should enable all but instances with names ending with “foo”', function () {
    try {
      localStorage.debug = '*,-*foo'

      var foo = Logdown('foo')
      var bar = Logdown('bar')
      var foobar = Logdown('foobar')
      var barfoo = Logdown('barfoo')

      foo.log('lorem')
      barfoo.log('lorem')
      assert.notCalled(console.log)
      bar.log('lorem')
      foobar.log('lorem')
      assert.calledTwice(console.log)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`localStorage.debug=*,-foo*` should enable all but instances with names beginning with “foo”', function () {
    try {
      localStorage.debug = '*,-foo*'

      var foo = Logdown('foo')
      var bar = Logdown('bar')
      var foobar = Logdown('foobar')
      var barfoo = Logdown('barfoo')

      foobar.log('lorem')
      foo.log('lorem')
      assert.notCalled(console.log)
      bar.log('lorem')
      barfoo.log('lorem')
      assert.calledTwice(console.log)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`localStorage.debug` should accept N arguments', function () {
    try {
      Logdown.enable('*')
      localStorage.debug = 'foo,barfoo'

      var foo = Logdown('foo')
      var bar = Logdown('bar')
      var foobar = Logdown('foobar')
      var barfoo = Logdown('barfoo')

      bar.log('lorem')
      foobar.log('lorem')
      assert.notCalled(console.log)
      foo.log('lorem')
      barfoo.log('lorem')
      assert.calledTwice(console.log)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })
})
