/* eslint-env jest */

var logdown = require('../../src/node')

describe('NODE_DEBUG and DEBUG environment variables', function () {
  // NODE_DEBUG is the official env var supported by Node
  // https://nodejs.org/api/util.html#util_util_debuglog_section
  // DEBUG is for compatibility with the debug lib
  var envVars = ['NODE_DEBUG', 'DEBUG']

  beforeEach(function () {
    envVars.forEach(function (envVar) {
      process.env[envVar] = ''
    })
    console.log = jest.fn()
    logdown.enable('*')
    logdown._instances = []
  })

  afterEach(function () {
    console.log.mockClear()
  })

  envVars.forEach(function (envVar) {
    it('`' + envVar + '=foo` should enable only instances with “foo” prefix', function () {
      process.env[envVar] = 'foo'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var quz = logdown('quz')
      var baz = logdown('baz')

      bar.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      quz.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      baz.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      foo.log('lorem')
      expect(console.log).toHaveBeenCalled()
    })

    it('`' + envVar + '=*foo` should enable only instances with names ending with “foo”', function () {
      process.env[envVar] = '*foo'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      bar.log('lorem')
      foobar.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      foo.log('lorem')
      barfoo.log('lorem')
      expect(console.log).toHaveBeenCalledTimes(2)
    })

    it('`' + envVar + '=foo*` should enable only instances with names beginning with “foo”', function () {
      process.env[envVar] = 'foo*'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      bar.log('lorem')
      barfoo.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      foobar.log('lorem')
      foo.log('lorem')
      expect(console.log).toHaveBeenCalledTimes(2)
    })

    it('`' + envVar + '=-*` should disable all instances', function () {
      process.env[envVar] = '-*'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      foobar.log('lorem')
      foo.log('lorem')
      bar.log('lorem')
      barfoo.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
    })

    it('`' + envVar + '=*,-foo` should enable all but only instances with “foo” prefix', function () {
      process.env[envVar] = '*,-foo'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var quz = logdown('quz')
      var baz = logdown('baz')

      foo.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      bar.log('lorem')
      quz.log('lorem')
      baz.log('lorem')
      expect(console.log).toHaveBeenCalledTimes(3)
    })

    it('`' + envVar + '=*,-*foo` should enable all but instances with names ending with “foo”', function () {
      process.env[envVar] = '*,-*foo'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      foo.log('lorem')
      barfoo.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      bar.log('lorem')
      foobar.log('lorem')
      expect(console.log).toHaveBeenCalledTimes(2)
    })

    it('`' + envVar + '=*,-foo*` should enable all but instances with names beginning with “foo”', function () {
      process.env[envVar] = '*,-foo*'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      foobar.log('lorem')
      foo.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      bar.log('lorem')
      barfoo.log('lorem')
      expect(console.log).toHaveBeenCalledTimes(2)
    })

    it('`' + envVar + '` should accept N arguments', function () {
      logdown.enable('*')
      process.env[envVar] = 'foo,barfoo'

      var foo = logdown('foo')
      var bar = logdown('bar')
      var foobar = logdown('foobar')
      var barfoo = logdown('barfoo')

      bar.log('lorem')
      foobar.log('lorem')
      expect(console.log).not.toHaveBeenCalled()
      foo.log('lorem')
      barfoo.log('lorem')
      expect(console.log).toHaveBeenCalledTimes(2)
    })
  })

  // If `NODE_DEBUG` and `DEBUG` is declared, we should omit `DEBUG` and only
  // get the values in `NODE_DEBUG`
  it('`NODE_DEBUG` should have precedence over `DEBUG`', function () {
    process.env.NODE_DEBUG = 'foo,barfoo'
    process.env.DEBUG = 'bar,foobar'

    var foo = logdown('foo')
    var bar = logdown('bar')
    var foobar = logdown('foobar')
    var barfoo = logdown('barfoo')

    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })
})
