/* global describe, afterEach, beforeEach, console, it, require, window, Logdown, chai, sinon */

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

  describe('Logdown.enable', function () {
    var sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()

      sandbox.stub(window.console, 'log')
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

    it(
      '`(\'foo\')` should enable only instances with “foo” prefix',
      function () {
        try {
          var foo = new Logdown('foo')
          var bar = new Logdown('bar')
          var quz = new Logdown('quz')
          var baz = new Logdown('baz')

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
           var foo = new Logdown('foo')
           var bar = new Logdown('bar')
           var foobar = new Logdown('foobar')
           var barfoo = new Logdown('barfoo')

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
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var quz = new Logdown('quz')
        var baz = new Logdown('baz')

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
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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
        var foo = new Logdown('foo')
        var bar = new Logdown('bar')
        var foobar = new Logdown('foobar')
        var barfoo = new Logdown('barfoo')

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
}())
