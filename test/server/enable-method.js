/* global describe, it, beforeEach, afterEach */

var chai = require('chai')
var sinon = require('sinon')
var logdown = require('../../src/logdown')

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

function createInstances () {
  return [
    logdown('foo'),
    logdown('bar'),
    logdown('quz'),
    logdown('baz')
  ]
}

describe('logdown.enable', function () {
  var sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    sandbox.stub(global.console, 'log')

    logdown.enable('*')
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('`(\'*\')` should enable all instances', function () {
    try {
      logdown.disable('*')
      logdown.enable('*')
      var instances = createInstances()
      instances.forEach(function (instance) {
        instance.log('Lorem')
      })

      assert.called(console.log)
      sandbox.restore()
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`(\'foo\')` should enable only instances with “foo” prefix',
     function () {
       try {
         var foo = logdown('foo')
         var bar = logdown('bar')
         var quz = logdown('quz')
         var baz = logdown('baz')

         logdown.disable('*')
         logdown.enable('foo')

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

  it('`(\'*foo\')` should enable only instances with names ending with “foo”',
     function () {
       try {
         var foo = logdown('foo')
         var bar = logdown('bar')
         var foobar = logdown('foobar')
         var barfoo = logdown('barfoo')

         logdown.disable('*')
         logdown.enable('*foo')

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

  it('`(\'foo*\')` should enable only instances with names ' +
     'beginning with “foo”', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.disable('*')
      logdown.enable('foo*')

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

  it('`(\'-*\')` should disable all instances', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.enable('-*')

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

  it('`(\'*\', \'-foo\')` should enable all but only instances ' +
     'with “foo” prefix', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var quz = logdown('quz')
      var baz = logdown('baz')

      logdown.enable('*', '-foo')

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

  it('`(\'*\', \'-*foo\')` should enable all but instances with names ' +
     'ending with “foo”', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.enable('*', '-*foo')

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

  it('`(\'*\', \'-foo*\')` should enable all but instances with names ' +
     'beginning with “foo”', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.enable('*', '-foo*')

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

  it('should accept N arguments', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.disable('*')
      logdown.enable('foo', 'barfoo')

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
