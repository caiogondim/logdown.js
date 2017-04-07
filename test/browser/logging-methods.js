/* eslint-env jest */

const logdown = require('../../src/browser')

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

    it('should parse markdown if enabled', () => {
      var foo = logdown({markdown: true})

      foo[method]('lorem *ipsum*')
      expect(console[method]).toHaveBeenCalledWith(
        'lorem %cipsum%c',
        'font-weight:bold;',
        ''
      )

      foo[method]('lorem _ipsum_')
      expect(console[method]).toHaveBeenCalledWith(
        'lorem %cipsum%c',
        'font-style:italic;',
        ''
      )

      foo[method]('lorem `ipsum`')
      expect(console[method]).toHaveBeenCalledWith(
        'lorem %cipsum%c',
        'background-color:rgba(255,204,102, 0.1);' +
          'color:#FFCC66;' +
          'padding:2px 5px;' +
          'border-radius:2px;',
        ''
      )

      foo[method]('lorem `ipsum` *dolor* sit _amet_')
      expect(console[method]).toHaveBeenCalledWith(
        'lorem %cipsum%c %cdolor%c sit %camet%c',
        'background-color:rgba(255,204,102, 0.1);' +
          'color:#FFCC66;' +
          'padding:2px 5px;' +
          'border-radius:2px;',
        '',
        'font-weight:bold;',
        '',
        'font-style:italic;',
        ''
      )
    })

    it('should not parse markdown if disabled', () => {
      const foo = logdown({markdown: false})

      foo[method]('lorem *ipsum*')
      expect(console[method]).toHaveBeenCalledWith('lorem *ipsum*')

      foo[method]('lorem _ipsum_ dolor')
      expect(console[method]).toHaveBeenCalledWith('lorem _ipsum_ dolor')

      foo[method]('lorem `ipsum` dolor')
      expect(console[method]).toHaveBeenCalledWith('lorem `ipsum` dolor')
    })

    it('should print prefix if present', () => {
      const foo = logdown('foo')

      foo[method]('lorem ipsum')
      expect(console[method]).toHaveBeenCalledWith(
        '%cfoo%c lorem ipsum',
        'color:' + foo.opts.prefixColor + '; font-weight:bold;',
        ''
      )
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
    it('should print not-string arguments as is', () => {
      const foo = logdown()
      const obj = {foo: 1, bar: 2}
      foo[method](obj)
      expect(console[method]).toHaveBeenCalledWith(obj)
    })
  })
})
