/* global describe, console, it, require, window, Logdown, chai, sinon */

;(function () {
  'use strict'

  sinon.assert.expose(chai.assert, {prefix: ''})
  var assert = chai.assert

  describe('new Logdown()', function () {
    it('should return an existing instance if the prefix is already in use',
       function () {
         var foo = new Logdown({prefix: 'foo'})
         var foo2 = new Logdown({prefix: 'foo'})
         assert.equal(foo, foo2)
       })

    it('should give a new prefix color for each instance', function () {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var quz = new Logdown({prefix: 'quz'})
      var baz = new Logdown({prefix: 'baz'})
      assert.notEqual(foo.prefixColor, bar.prefixColor)
      assert.notEqual(foo.prefixColor, quz.prefixColor)
      assert.notEqual(foo.prefixColor, baz.prefixColor)
    })

    it('should sanitize prefixes name', function () {
      var log1 = new Logdown({prefix: '%cfoo%c'})
      assert.equal(log1.prefix, 'foo')

      var log2 = new Logdown({prefix: '%cba%cr'})
      assert.equal(log2.prefix, 'bar')
    })
  })
}())
