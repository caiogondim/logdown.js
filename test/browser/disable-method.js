/* global describe, beforeEach, console, it, require, window, logdown, chai, sinon */

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

describe('logdown.disable', function () {
  var sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()

    sandbox.stub(window.console, 'log')
  })

  it('`(\'*\')` should disable all instances', function () {
    logdown.enable('*')
    logdown.disable('*')
    var instances = createInstances()
    instances.forEach(function (instance) {
      instance.log('Lorem')
    })

    assert.notCalled(console.log)

    sandbox.restore()
  })

  it('`(\'foo\')` should disable only instances with “foo” prefix',
     function () {
       try {
         var foo = logdown('foo')
         var bar = logdown('bar')
         var quz = logdown('quz')
         var baz = logdown('baz')

         logdown.enable('*')
         logdown.disable('foo')

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
     'with “foo”', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.enable('*')
      logdown.disable('*foo')

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
     'with “foo”', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.enable('*')
      logdown.disable('foo*')

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

  it('`(\'*\')` should disable all instances', function () {
    try {
      logdown.enable('*')
      logdown.disable('*')
      var instances = createInstances()
      instances.forEach(function (instance) {
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
     '“foo” prefix', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var quz = logdown('quz')
      var baz = logdown('baz')

      logdown.enable('*')
      logdown.disable('foo')

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
     'ending with “foo”', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.disable('*', '-*foo')

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
     'beginning with “foo”', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.disable('*', '-foo*')

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

  it('`(\'-*\')` should not disable any instances', function () {
    try {
      logdown.disable('-*')
      var instances = createInstances()
      instances.forEach(function (instance) {
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
     function () {
       try {
         var foo = logdown('foo')
         var bar = logdown('bar')
         var quz = logdown('quz')
         var baz = logdown('baz')

         logdown.disable('*', '-foo')

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

  it('should accept N arguments', function () {
    try {
      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      logdown.enable('*')
      logdown.disable('foo', 'barfoo')

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
