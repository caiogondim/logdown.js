/* global describe, it, beforeEach, afterEach */

var chai = require('chai')
var sinon = require('sinon')
var logdown = require('../../src/index')

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

describe('NODE_DEBUG and DEBUG environment variables', function () {
  var sandbox
  // NODE_DEBUG is the official env var supported by Node
  // https://nodejs.org/api/util.html#util_util_debuglog_section
  // DEBUG is for compatibility with the debug lib
  var envVars = ['NODE_DEBUG', 'DEBUG']

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    sandbox.stub(global.console, 'log')

    envVars.forEach(function (envVar) {
      process.env[envVar] = ''
    })
    logdown.enable('*')
    logdown._instances = []
  })

  afterEach(function () {
    sandbox.restore()
  })

  envVars.forEach(function (envVar) {
    it('`' + envVar + '=foo` should enable only instances with “foo” prefix', function () {
      try {
        process.env[envVar] = 'foo'

        var foo = logdown('foo')
        var bar = logdown('bar')
        var quz = logdown('quz')
        var baz = logdown('baz')

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

    it('`' + envVar + '=*foo` should enable only instances with names ending with “foo”', function () {
      try {
        process.env[envVar] = '*foo'

        var foo = logdown('foo')
        var bar = logdown('bar')
        var foobar = logdown('foobar')
        var barfoo = logdown('barfoo')

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

    it('`' + envVar + '=foo*` should enable only instances with names beginning with “foo”', function () {
      try {
        process.env[envVar] = 'foo*'

        var foo = logdown('foo')
        var bar = logdown('bar')
        var foobar = logdown('foobar')
        var barfoo = logdown('barfoo')

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

    it('`' + envVar + '=-*` should disable all instances', function () {
      try {
        process.env[envVar] = '-*'

        var foo = logdown('foo')
        var bar = logdown('bar')
        var foobar = logdown('foobar')
        var barfoo = logdown('barfoo')

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

    it('`' + envVar + '=*,-foo` should enable all but only instances with “foo” prefix', function () {
      try {
        process.env[envVar] = '*,-foo'

        var foo = logdown('foo')
        var bar = logdown('bar')
        var quz = logdown('quz')
        var baz = logdown('baz')

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

    it('`' + envVar + '=*,-*foo` should enable all but instances with names ending with “foo”', function () {
      try {
        process.env[envVar] = '*,-*foo'

        var foo = logdown('foo')
        var bar = logdown('bar')
        var foobar = logdown('foobar')
        var barfoo = logdown('barfoo')

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

    it('`' + envVar + '=*,-foo*` should enable all but instances with names beginning with “foo”', function () {
      try {
        process.env[envVar] = '*,-foo*'

        var foo = logdown('foo')
        var bar = logdown('bar')
        var foobar = logdown('foobar')
        var barfoo = logdown('barfoo')

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

    it('`' + envVar + '` should accept N arguments', function () {
      try {
        logdown.enable('*')
        process.env[envVar] = 'foo,barfoo'

        var foo = logdown('foo')
        var bar = logdown('bar')
        var foobar = logdown('foobar')
        var barfoo = logdown('barfoo')

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

  // If `NODE_DEBUG` and `DEBUG` is declared, we should omit `DEBUG` and only
  // get the values in `NODE_DEBUG`
  it('`NODE_DEBUG` should have precedence over `DEBUG`', function () {
    try {
      process.env.NODE_DEBUG = 'foo,barfoo'
      process.env.DEBUG = 'bar,foobar'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

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
