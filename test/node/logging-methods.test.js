/* eslint-env jest */

const logdown = require('../../src/node')
const markdown = require('../../src/markdown/node')

//
// Tests
//

;['debug', 'log', 'info', 'warn', 'error'].forEach(method => {
  describe(`logdown.${method}`, () => {
    beforeEach(() => {
      console[method] = console[method] || console.log
      console[method] = jest.fn()

      logdown._instances = []
      logdown.enable('*')
      process.env.NODE_DEBUG = 'foo'
    })

    afterEach(() => {
      console[method].mockClear()
    })

    it('outputs multiple arguments', () => {
      const foo = logdown('foo', { markdown: true })

      foo[method]('one', 'two', 'three')

      expect(console[method]).toHaveBeenCalledWith(
        foo._getDecoratedPrefix(method),
        'one',
        'two',
        'three'
      )
    })

    it('parses markdown in multiple arguments', () => {
      const foo = logdown('foo')

      foo[method]('one', '*two*', 'three')

      expect(console[method]).toHaveBeenCalledWith(
        foo._getDecoratedPrefix(method),
        'one',
        markdown.parse('*two*').text,
        'three'
      )
    })

    it('parses markdown if enabled', () => {
      const foo = logdown('foo', { markdown: true })

      foo[method]('lorem *ipsum*')
      expect(console[method]).toHaveBeenCalledWith(
        foo._getDecoratedPrefix(method),
        markdown.parse('lorem *ipsum*').text
      )

      foo[method]('lorem _ipsum_')
      expect(console[method]).toHaveBeenCalledWith(
        foo._getDecoratedPrefix(method),
        markdown.parse('lorem _ipsum_').text
      )

      foo[method]('lorem `ipsum`')
      expect(console[method]).toHaveBeenCalledWith(
        foo._getDecoratedPrefix(method),
        markdown.parse('lorem `ipsum`').text
      )
    })

    it('doesnt parse markdown if disabled', () => {
      const foo = logdown('foo', { markdown: false })

      foo[method]('lorem *ipsum*')
      expect(console[method]).toHaveBeenCalledWith(
        foo._getDecoratedPrefix(method),
        'lorem *ipsum*'
      )

      foo[method]('lorem _ipsum_ dolor')
      expect(console[method]).toHaveBeenCalledWith(
        foo._getDecoratedPrefix(method),
        'lorem _ipsum_ dolor'
      )
    })

    it('can add whitespace to align logger output', () => {
      const abc = logdown('abc')
      const text = logdown('text', { alignOutput: 'yes' })
      const demo = logdown('demo', { alignOutput: true })
      const longDemo = logdown('longDemo', { alignOutput: true })
      const demoFalse = logdown('demoFalse', { alignOutput: false })
      const longerDemo = logdown('longerDemo', { alignOutput: true })

      expect(abc.opts.prefix.length).toBe(3)
      expect(abc.opts.alignOutput).toBe(false)

      expect(text.opts.prefix.length).toBe(10)
      expect(text.opts.alignOutput).toBe(true)

      expect(demo.opts.prefix.length).toBe(10)
      expect(demo.opts.alignOutput).toBe(true)

      expect(longDemo.opts.prefix.length).toBe(10)
      expect(longDemo.opts.alignOutput).toBe(true)

      expect(demoFalse.opts.prefix.length).toBe(9)
      expect(demoFalse.opts.alignOutput).toBe(false)

      expect(longerDemo.opts.prefix.length).toBe(10)
      expect(longerDemo.opts.alignOutput).toBe(true)
    })

    // https://github.com/caiogondim/logdown/issues/14
    it('prints not-string arguments as is', () => {
      const foo = logdown('foo')
      const obj = { bar: 2, foo: 1 }
      foo[method](obj)
      expect(console[method]).toHaveBeenCalledWith(
        foo._getDecoratedPrefix(method),
        obj
      )
    })
  })
})
