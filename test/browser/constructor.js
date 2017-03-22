/* global describe, console, it, require, window, logdown, chai, sinon */

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

describe('logdown()', function () {
  it('should return an existing instance if the prefix is already in use',
     function () {
       var foo = logdown('foo')
       var foo2 = logdown('foo')
       assert.equal(foo, foo2)
     })

  it('should give a new prefix color for each instance', function () {
    var foo = logdown('foo')
    var bar = logdown('bar')
    var quz = logdown('quz')
    var baz = logdown('baz')
    assert.notEqual(foo.opts.prefixColor, bar.opts.prefixColor)
    assert.notEqual(foo.opts.prefixColor, quz.opts.prefixColor)
    assert.notEqual(foo.opts.prefixColor, baz.opts.prefixColor)
  })

  // For compatibiltiy with debug
  it('should set prefix if string is passed as only argument', function () {
    var log1 = logdown('foo')
    assert.equal(log1.opts.prefix, 'foo')
  })
})
