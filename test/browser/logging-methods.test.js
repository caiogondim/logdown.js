/* eslint-env jest */

jest.mock('../../src/util/is-webkit', () => () => true)
jest.mock('../../src/util/is-color-supported/browser', () => () => true)

const logdown = require('../../src/browser')
const markdown = require('../../src/markdown/browser')

const methods = ['debug', 'log', 'info', 'warn', 'error']
methods.forEach((method) => {
  describe('logdown.' + method, () => {
    beforeEach(() => {
      console[method] = console[method] || console.log
      console[method] = jest.fn()

      logdown.enable('*')
      logdown._instances = []
    })

    afterEach(() => {
      console[method].mockClear()
    })

    it('parses markdown if enabled', () => {
      const foo = logdown('foo', { markdown: true })

      ;[
        'lorem *ipsum*',
        'lorem _ipsum_',
        'lorem `ipsum`',
        'lorem `ipsum` *dolor* sit _amet_'
      ].forEach(str => {
        foo[method](str)

        let expectedArgs = foo._getDecoratedPrefix()
        expectedArgs[0] = expectedArgs[0] + markdown.parse(str).text
        expectedArgs = expectedArgs.concat(markdown.parse(str).styles)

        expect(console[method]).toHaveBeenLastCalledWith(...expectedArgs)
      })
    })

    it('doesnt parse markdown if disabled', () => {
      const foo = logdown('foo', { markdown: false })

      ;[
        'lorem *ipsum*',
        'lorem _ipsum_',
        'lorem `ipsum`',
        'lorem `ipsum` *dolor* sit _amet_'
      ].forEach(str => {
        foo[method](str)

        let expectedArgs = foo._getDecoratedPrefix()
        expectedArgs[0] = expectedArgs[0] + str

        expect(console[method]).toHaveBeenLastCalledWith(...expectedArgs)
      })
    })

    it('can add whitespace to align logger output', () => {
      const abc = logdown('abc')
      const text = logdown('text', {alignOutput: 'yes'})
      const demo = logdown('demo', {alignOutput: true})
      const longDemo = logdown('longDemo', {alignOutput: true})
      const demoFalse = logdown('demoFalse', {alignOutput: false})
      const longerDemo = logdown('longerDemo', {alignOutput: true})

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
      const obj = { foo: 1, bar: 2 }

      foo[method](obj)

      let expectedArgs = foo._getDecoratedPrefix()
      expectedArgs = expectedArgs.concat(obj)
      expect(console[method]).toHaveBeenLastCalledWith(...expectedArgs)
    })
  })
})
