/* global describe, beforeEach, console, it, require, window, Logdown, chai, sinon */

;(function () {
  'use strict'

  sinon.assert.expose(chai.assert, {prefix: ''})
  var assert = chai.assert

  function createInstances () {
    return [
      new Logdown('foo'),
      new Logdown('bar'),
      new Logdown('quz'),
      new Logdown('baz')
    ]
  }

  describe('Logdown.disable', function () {
    var sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()

      sandbox.stub(window.console, 'log')
    })

    it('`(\'*\')` should disable all instances', function () {
      Logdown.enable('*')
      Logdown.disable('*')
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
           var foo = new Logdown('foo')
           var bar = new Logdown('bar')
           var quz = new Logdown('quz')
           var baz = new Logdown('baz')

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
       'with “foo”', function () {
      try {
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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
       'with “foo”', function () {
      try {
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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

    it('`(\'*\')` should disable all instances', function () {
      try {
        Logdown.enable('*')
        Logdown.disable('*')
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
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var quz = new Logdown('quz')
        var baz = new Logdown('baz')

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
       'ending with “foo”', function () {
      try {
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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
       'beginning with “foo”', function () {
      try {
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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

    it('`(\'-*\')` should not disable any instances', function () {
      try {
        Logdown.disable('-*')
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
           var foo = new Logdown('foo')
           var bar = new Logdown('bar')
           var quz = new Logdown('quz')
           var baz = new Logdown('baz')

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

    it('should accept N arguments', function () {
      try {
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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
}())
