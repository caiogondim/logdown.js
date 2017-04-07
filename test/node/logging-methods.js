/* eslint-env jest */

const logdown = require('../../src/node')
const ansiColors = require('../../src/util/ansi-colors')

//
// Helpers
//

const getSymbol = (method) => {
  switch (method) {
    case 'debug':
      return `\u001b[${ansiColors.colors.gray[0]}m🐞 \u001b[${ansiColors.colors.gray[1]}m `
    case 'info':
      return `\u001b[${ansiColors.colors.blue[0]}mℹ️ \u001b[${ansiColors.colors.blue[1]}m `
    case 'warn':
      return `\u001b[${ansiColors.colors.yellow[0]}m⚠️ \u001b[${ansiColors.colors.yellow[1]}m `
    case 'error':
      return `\u001b[${ansiColors.colors.red[0]}m❌ \u001b[${ansiColors.colors.red[1]}m `
    default:
      return ''
  }
}

//
// Tests
//

;['debug', 'log', 'info', 'warn', 'error'].forEach(method => {
  describe(`logdown.${method}`, () => {
    const symbol = getSymbol(method)

    beforeEach(() => {
      console[method] = console[method] || console.log
      console[method] = jest.fn()

      logdown._instances = []
      logdown.enable('*')
      process.env.NODE_DEBUG = ''
    })

    afterEach(() => {
      console[method].mockClear()
    })

    it('should output multiple arguments', () => {
      const foo = logdown({markdown: true})

      foo[method]('one', 'two', 'three')

      const args = [
        symbol,
        'one',
        'two',
        'three'
      ]

      if (method === 'log') {
        expect(console[method]).toHaveBeenCalledWith(
          args[1],
          args[2],
          args[3]
        )
      } else {
        // throw new Error('aksj')
        expect(console[method]).toHaveBeenCalledWith(
          args[0],
          args[1],
          args[2],
          args[3]
        )
      }
    })

    it('should parse markdown in multiple arguments', () => {
      const foo = logdown({markdown: true})

      const args = [
        symbol,
        'one',
        `\u001b[${ansiColors.modifiers.bold[0]}mtwo\u001b[${ansiColors.modifiers.bold[1]}m`,
        'three'
      ]

      foo[method]('one', '*two*', 'three')

      if (method === 'log') {
        expect(console[method]).toHaveBeenCalledWith(
          args[1],
          args[2],
          args[3]
        )
      } else {
        expect(console[method]).toHaveBeenCalledWith(
          args[0],
          args[1],
          args[2],
          args[3]
        )
      }
    })

    it('should parse markdown if enabled', () => {
      const foo = logdown({ markdown: true })

      const args1 = [
        symbol,
        `lorem \u001b[${ansiColors.modifiers.bold[0]}mipsum\u001b[${ansiColors.modifiers.bold[1]}m`
      ]

      foo[method]('lorem *ipsum*')

      if (method === 'log') {
        expect(console[method]).toHaveBeenCalledWith(
          args1[1]
        )
      } else {
        expect(console[method]).toHaveBeenCalledWith(
          args1[0],
          args1[1]
        )
      }

      const args2 = [
        symbol,
        `lorem \u001b[${ansiColors.modifiers.italic[0]}mipsum\u001b[${ansiColors.modifiers.italic[1]}m`
      ]

      foo[method]('lorem _ipsum_')

      if (method === 'log') {
        expect(console[method]).toHaveBeenCalledWith(
          args2[1]
        )
      } else {
        expect(console[method]).toHaveBeenCalledWith(
          args2[0],
          args2[1]
        )
      }

      const args3 = [
        symbol,
        `lorem \u001b[${ansiColors.colors.yellow[0]}mipsum\u001b[${ansiColors.colors.yellow[1]}m`
      ]

      foo[method]('lorem `ipsum`')

      if (method === 'log') {
        expect(console[method]).toHaveBeenCalledWith(
          args3[1]
        )
      } else {
        expect(console[method]).toHaveBeenCalledWith(
          args3[0],
          args3[1]
        )
      }
    })

    it('should not parse markdown if disabled', () => {
      const foo = logdown({ markdown: false })

      const args1 = [
        symbol,
        'lorem *ipsum*'
      ]

      foo[method]('lorem *ipsum*')

      if (method === 'log') {
        expect(console[method]).toHaveBeenCalledWith(
          args1[1]
        )
      } else {
        expect(console[method]).toHaveBeenCalledWith(
          args1[0],
          args1[1]
        )
      }

      //

      const args2 = [
        symbol,
        'lorem _ipsum_ dolor'
      ]

      foo[method]('lorem _ipsum_ dolor')

      if (method === 'log') {
        expect(console[method]).toHaveBeenCalledWith(
          args2[1]
        )
      } else {
        expect(console[method]).toHaveBeenCalledWith(
          args2[0],
          args2[1]
        )
      }
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
    it('should print not-string arguments as is', () => {
      const foo = logdown('foo')
      const obj = {bar: 2, foo: 1}
      foo[method](obj)
      expect(console[method]).toHaveBeenCalledWith(
        `${symbol}\u001b[${foo.opts.prefixColor[0]}m\u001b[${ansiColors.modifiers.bold[0]}m${foo.opts.prefix}\u001b[${ansiColors.modifiers.bold[1]}m\u001b[${foo.opts.prefixColor[1]}m`,
        obj
      )
    })
  })
})
