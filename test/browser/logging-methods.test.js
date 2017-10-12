/* eslint-env jest */

jest.mock('../../src/util/is-webkit', () => () => true)
jest.mock('../../src/util/is-color-supported/browser', () => () => true)

// Mock localStorage
const globalObject = require('../../src/util/get-global')()
const localStorage = require('../mocks/local-storage')
globalObject.localStorage = localStorage

const logdown = require('../../src/browser')
const markdown = require('../../src/markdown/browser')

const consoleMethods = Object.keys(console)
  .filter(method => typeof console[method] === 'function')

const toMarkdown = (logger, str, ...rest) => {
  let expectedArgs = logger._getDecoratedPrefix()
  expectedArgs[0] = expectedArgs[0] + markdown.parse(str).text

  return expectedArgs.concat(markdown.parse(str).styles).concat(rest)
}

consoleMethods.forEach((method) => {
  describe('logdown.' + method, () => {
    beforeEach(() => {
      jest.spyOn(console, method).mockImplementation(jest.fn())

      logdown._instances = []
      localStorage.setItem('debug', 'foo')
      logdown._setPrefixRegExps()
    })

    afterEach(() => {
      console[method].mockRestore()
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

        expect(console[method]).toHaveBeenLastCalledWith(...toMarkdown(foo, str))
      })
    })

    it('parses markdown only for first arg', () => {
      const foo = logdown('foo', { markdown: true })
      const str = 'lorem *ipsum*'

      foo[method](str, str)

      expect(console[method]).toHaveBeenLastCalledWith(...toMarkdown(foo, str, str))
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

    // https://github.com/caiogondim/logdown/issues/14
    it('prints not-string arguments as is', () => {
      const foo = logdown('foo')
      const obj = { foo: 1, bar: 2 }

      foo[method](obj)

      let expectedArgs = foo._getDecoratedPrefix()
      expectedArgs = expectedArgs.concat(obj)
      expect(console[method]).toHaveBeenLastCalledWith(...expectedArgs)
    })

    it('doesnt print is state.isEnable is false', () => {
      const foo = logdown('foo')
      foo.state.isEnabled = false
      foo[method]('lorem')

      expect(console[method]).not.toHaveBeenCalled()
    })

    it('has a facade for every method on opts.logger', () => {
      const foo = logdown('foo', { logger: console })

      consoleMethods.forEach(consoleMethod => {
        expect(typeof foo[consoleMethod]).toBe('function')
      })
    })
  })
})
