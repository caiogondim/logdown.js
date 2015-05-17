/* global describe, it, beforeEach */
/* jshint node:true */

'use strict'

var chai = require('chai')
var sinon = require('sinon')
var Logdown = require('../../src/')

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

function createInstances() {
  return [
    new Logdown({prefix: 'foo'}),
    new Logdown({prefix: 'bar'}),
    new Logdown({prefix: 'quz'}),
    new Logdown({prefix: 'baz'})
  ]
}

describe('Logdown.disable', function() {
  var sandbox

  beforeEach(function() {
    sandbox = sinon.sandbox.create()
    sandbox.stub(global.console, 'log')

    Logdown.enable('*')
  })

  it('`(\'*\')` should disable all instances', function() {
    Logdown.enable('*')
    Logdown.disable('*')
    var instances = createInstances()
    instances.forEach(function(instance) {
      instance.log('Lorem')
    })

    assert.notCalled(console.log)

    sandbox.restore()
  })

  it('`(\'foo\')` should disable only instances with “foo” prefix',
     function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var quz = new Logdown({prefix: 'quz'})
      var baz = new Logdown({prefix: 'baz'})

      Logdown.enable('*')
      Logdown.disable('foo')

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

  it('`(\'*foo\')` should disable only instances with names ending' +
     'with “foo”', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.enable('*')
      Logdown.disable('*foo')

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

  it('`(\'foo*\')` should disable only instances with names beginning ' +
     'with “foo”', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.enable('*')
      Logdown.disable('foo*')

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

  it('`(\'*\')` should disable all instances', function() {
    try {
      Logdown.enable('*')
      Logdown.disable('*')
      var instances = createInstances()
      instances.forEach(function(instance) {
        instance.log('Lorem')
      })

      assert.notCalled(console.log)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`(\'foo\')` should disable only instances with ' +
     '“foo” prefix', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var quz = new Logdown({prefix: 'quz'})
      var baz = new Logdown({prefix: 'baz'})

      Logdown.enable('*')
      Logdown.disable('foo')

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

  it('`(\'*\', \'-*foo\')` should disable all but instances with names ' +
     'ending with “foo”', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.disable('*', '-*foo')

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

  it('`(\'*\', \'-foo*\')` should disable all but instances with names ' +
     'beginning with “foo”', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.disable('*', '-foo*')

      bar.log('lorem')
      barfoo.log('lorem')
      assert.notCalled(console.log)
      foobar.log('lorem')
      foo.log('lorem')
      assert.calledTwice(console.log)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`(\'-*\')` should not disable any instances', function() {
    try {
      Logdown.disable('-*')
      var instances = createInstances()
      instances.forEach(function(instance) {
        instance.log('Lorem')
      })
      assert.callCount(console.log, 4)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('`(\'*\', \'-foo\')` should disable all but instances with “foo” prefix',
     function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var quz = new Logdown({prefix: 'quz'})
      var baz = new Logdown({prefix: 'baz'})

      Logdown.disable('*', '-foo')

      bar.log('lorem')
      quz.log('lorem')
      baz.log('lorem')
      assert.notCalled(console.log)
      foo.log('lorem')
      assert.calledOnce(console.log)
    } catch (error) {
      sandbox.restore()
      throw error
    }

    sandbox.restore()
  })

  it('should accept N arguments', function() {
    try {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var foobar = new Logdown({prefix: 'foobar'})
      var barfoo = new Logdown({prefix: 'barfoo'})

      Logdown.enable('*')
      Logdown.disable('foo', 'barfoo')

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
})
