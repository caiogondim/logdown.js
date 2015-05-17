/* global describe, it, beforeEach, afterEach, xit */
/* jshint node:true */

'use strict'

var chai = require('chai')
var sinon = require('sinon')
var Logdown = require('../../src/')

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

describe('NODE_DEBUG and DEBUG environment variables', function() {
  var sandbox

  beforeEach(function() {
    sandbox = sinon.sandbox.create()
    sandbox.stub(global.console, 'log')

    Logdown.enable('*')
  })

  afterEach(function() {
    sandbox.restore()
  })

  it('`NODE_DEBUG=foo` should enable only instances with “foo” prefix',
     function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var quz = new Logdown({prefix: 'quz'})
      var baz = new Logdown({prefix: 'baz'})

      process.env.NODE_DEBUG = 'foo'

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

  xit('`NODE_DEBUG=*foo` should enable only instances with names ' +
     'ending with “foo”', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      process.env.NODE_DEBUG = '*foo'

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

  xit('`NODE_DEBUG=foo*` should enable only instances with names ' +
     'beginning with “foo”', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      process.env.NODE_DEBUG = 'foo*'

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

  it('`NODE_DEBUG=-*` should disable all instances', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      process.env.NODE_DEBUG = '-*'

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

  it('`NODE_DEBUG=*,-foo` should enable all but only instances ' +
     'with “foo” prefix', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var quz = new Logdown({prefix: 'quz'})
      var baz = new Logdown({prefix: 'baz'})

      process.env.NODE_DEBUG = '*,-foo'

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

  it('`NODE_DEBUG=*,-*foo` should enable all but instances with names ' +
     'ending with “foo”', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      process.env.NODE_DEBUG = '*,-*foo'

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

  it('NODE_DEBUG=`*,-foo*` should enable all but instances with names ' +
     'beginning with “foo”', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      process.env.NODE_DEBUG = '*,-foo*'

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

  it('NODE_DEBUG should accept N arguments', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.enable('*')
      process.env.NODE_DEBUG = 'foo,barfoo'

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
