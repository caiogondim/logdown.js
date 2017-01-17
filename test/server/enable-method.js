/* global describe, it, beforeEach, afterEach */

'use strict'

var chai = require('chai')
var sinon = require('sinon')
var Logdown = require('../../src/logdown')

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

function createInstances () {
  return [
    new Logdown({prefix: 'foo'}),
    new Logdown({prefix: 'bar'}),
    new Logdown({prefix: 'quz'}),
    new Logdown({prefix: 'baz'})
  ]
}

describe('Logdown.enable', function () {
  var sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    sandbox.stub(global.console, 'log')

    Logdown.enable('*')
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('`(\'*\')` should enable all instances', function () {
    try {
      Logdown.disable('*')
      Logdown.enable('*')
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
         var foo = new Logdown({prefix: 'foo'})
         var bar = new Logdown({prefix: 'bar'})
         var quz = new Logdown({prefix: 'quz'})
         var baz = new Logdown({prefix: 'baz'})

         Logdown.disable('*')
         Logdown.enable('foo')

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
         var foo = new Logdown({prefix: 'foo'})
         var bar = new Logdown({prefix: 'bar'})
         var foobar = new Logdown({prefix: 'foobar'})
         var barfoo = new Logdown({prefix: 'barfoo'})

         Logdown.disable('*')
         Logdown.enable('*foo')

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
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.disable('*')
      Logdown.enable('foo*')

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
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.enable('-*')

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
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var quz = new Logdown({prefix: 'quz'})
      var baz = new Logdown({prefix: 'baz'})

      Logdown.enable('*', '-foo')

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
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.enable('*', '-*foo')

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
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.enable('*', '-foo*')

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
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.disable('*')
      Logdown.enable('foo', 'barfoo')

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
