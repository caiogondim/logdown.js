/* eslint-env jest */

var logdown = require('../../src/node')

describe('NODE_DEBUG and DEBUG environment variables', () => {
  // NODE_DEBUG is the official env var supported by Node
  // https://nodejs.org/api/util.html#util_util_debuglog_section
  // DEBUG is for compatibility with the debug lib
  var envVars = ['NODE_DEBUG', 'DEBUG']
  var origEnv = process.env

  beforeEach(() => {
    console.log = jest.fn()
    logdown._instances = []
    process.env = {}
  })

  afterEach(() => {
    console.log.mockClear()
    process.env = origEnv
  })

  it('is disabled if no env vars set', () => {
    delete process.env

    logdown._setPrefixRegExps()

    expect(logdown._prefixRegExps).toHaveLength(0)
  })

  envVars.forEach((envVar) => {
    it('`' + envVar + '=foo` enables only instances with “foo” prefix', () => {
      process.env[envVar] = 'foo'
      logdown._setPrefixRegExps()

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

    it('`' + envVar + '=*foo` enables only instances with names ending with “foo”', () => {
      process.env[envVar] = '*foo'
      logdown._setPrefixRegExps()

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

    it('`' + envVar + '=foo*` enables only instances with names beginning with “foo”', () => {
      process.env[envVar] = 'foo*'
      logdown._setPrefixRegExps()

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

    it('`' + envVar + '=-*` disables all instances', () => {
      process.env[envVar] = '-*'
      logdown._setPrefixRegExps()

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

    it('`' + envVar + '=*,-foo` enables all but only instances with “foo” prefix', () => {
      process.env[envVar] = '*,-foo'
      logdown._setPrefixRegExps()

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

    it('`' + envVar + '=*,-*foo` enables all but instances with names ending with “foo”', () => {
      process.env[envVar] = '*,-*foo'
      logdown._setPrefixRegExps()

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

    it('`' + envVar + '=*,-foo*` enables all but instances with names beginning with “foo”', () => {
      process.env[envVar] = '*,-foo*'
      logdown._setPrefixRegExps()

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

    it('`' + envVar + '` accepts N arguments', () => {
      process.env[envVar] = 'foo,barfoo'
      logdown._setPrefixRegExps()

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
  it('`NODE_DEBUG` has precedence over `DEBUG`', () => {
    process.env['NODE_DEBUG'] = 'foo,barfoo'
    process.env['DEBUG'] = 'bar,foobar'
    logdown._setPrefixRegExps()

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

    process.env['NODE_DEBUG'] = ''
    process.env['DEBUG'] = ''
  })
})
