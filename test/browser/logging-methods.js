/* global describe, afterEach, beforeEach, console, it, require, window,
   logdown, chai, sinon, xit */

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

var methods = ['debug', 'log', 'info', 'warn', 'error']
methods.forEach(function (method) {
  describe('logdown::' + method, function () {
    var sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      sandbox.stub(window.console, method)

      logdown.enable('*')
      logdown._instances = []
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('should parse markdown if enabled', function () {
      try {
        var foo = logdown({markdown: true})

        foo[method]('lorem *ipsum*')
        assert.calledWith(
          console[method],
          'lorem %cipsum%c',
          'font-weight:bold;',
          ''
        )

        foo[method]('lorem _ipsum_')
        assert.calledWith(
          console[method],
          'lorem %cipsum%c',
          'font-style:italic;',
          ''
        )

        foo[method]('lorem `ipsum`')
        assert.calledWith(
          console[method],
          'lorem %cipsum%c',
          'background:#FDF6E3; color:#586E75; padding:1px 5px; ' +
            'border-radius:4px;',
          ''
        )

        foo[method]('lorem `ipsum` *dolor* sit _amet_')
        assert.calledWith(
          console[method],
          'lorem %cipsum%c %cdolor%c sit %camet%c',
          'background:#FDF6E3; color:#586E75; padding:1px 5px; ' +
            'border-radius:4px;',
          '',
          'font-weight:bold;',
          '',
          'font-style:italic;',
          ''
        )
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('should not parse markdown if disabled', function () {
      try {
        var foo = logdown({markdown: false})

        foo[method]('lorem *ipsum*')
        assert.calledWith(
          console[method],
          'lorem *ipsum*'
        )

        foo[method]('lorem _ipsum_ dolor')
        assert.calledWith(
          console[method],
          'lorem _ipsum_ dolor'
        )

        foo[method]('lorem `ipsum` dolor')
        assert.calledWith(
          console[method],
          'lorem `ipsum` dolor'
        )
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('should sanitize forbidden characters', function () {
      sandbox.restore()
    })

    it('should print prefix if present', function () {
      // var foo = logdown({prefix: 'foo'})

      // foo[method]('lorem ipsum')
      // try {
      //   assert.calledWith(
      //     console[method],
      //     '%cfoo%c lorem ipsum',
      //     'color:' + foo.prefixColor + '; font-weight:bold;',
      //     ''
      //   )
      // } catch (error) {
      //   sandbox.restore()
      //   throw error
      // }

      sandbox.restore()
    })

    it('can add whitespace to align logger output', function () {
      try {
        var abc = logdown('abc')
        var text = logdown('text', {alignOutput: 'yes'})
        var demo = logdown('demo', {alignOutput: true})
        var longDemo = logdown('longDemo', {alignOutput: true})
        var demoFalse = logdown('demoFalse', {alignOutput: false})
        var longerDemo = logdown('longerDemo', {alignOutput: true})

        assert.equal(
          abc.opts.prefix.length,
          3,
          'Skipping \'alignOutput\' will not add whitespace characters'
        )
        assert.equal(abc.opts.alignOutput, false)

        assert.equal(
          text.opts.prefix.length,
          10,
          'Inputs will be converted into Boolean values'
        )
        assert.equal(text.opts.alignOutput, true)

        assert.equal(
          demo.opts.prefix.length,
          10,
          'Padding will be added to make short names as long as the longest'
        )
        assert.equal(demo.opts.alignOutput, true)

        assert.equal(
          longDemo.opts.prefix.length,
          10,
          'Padding will be added to make long names as long as the longest'
        )
        assert.equal(longDemo.opts.alignOutput, true)

        assert.equal(
          demoFalse.opts.prefix.length,
          9,
          'Padding will be skipped if set to \'false\''
        )
        assert.equal(demoFalse.opts.alignOutput, false)

        assert.equal(
          longerDemo.opts.prefix.length,
          10,
          'The longest name will set the width for every other logger name'
        )
        assert.equal(longerDemo.opts.alignOutput, true)
      } catch (error) {
        sandbox.restore()
        throw error
      }
      sandbox.restore()
    })

    // https://github.com/caiogondim/logdown/issues/14
    xit('should print not-string arguments as is', function () {
      try {
        var foo = logdown()
        var obj = {foo: 1, bar: 2}
        foo[method](obj)
        assert.calledWith()
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    // it('should not print special characters if the enviroment does not ' +
    //    'support colors', function() {
    //   try {
    //     mockIEEnviroment()

    //     var bar = logdown()
    //     bar[method]('lorem *ipsum* dolor sit _amet_')
    //     assert.calledWith(
    //       console[method],
    //       'lorem *ipsum* dolor sit _amet_'
    //     )

    //     var foo = logdown({prefix: 'foo'})
    //     foo[method]('lorem *ipsum* dolor sit _amet_ foo bar `var foo = 1`')
    //     assert.calledWith(
    //       console[method],
    //       '[foo] lorem *ipsum* dolor sit _amet_ foo bar `var foo = 1`'
    //     )
    //   } catch (error) {
    //     mockWebkitEnviroment()
    //     sandbox.restore()
    //     throw error
    //   }

    //   mockWebkitEnviroment()
    //   sandbox.restore()
    // })

    // if (method === 'info' || method === 'warn' || method === 'error') {
    //   it('should prepend symbols on node.js', function() {
    //     unmockBrowserEnviroment()

    //     var bar = logdown()
    //     bar[method]('lorem *ipsum* dolor sit _amet_')
    //     assert.calledWith(
    //       console[method],
    //       'lorem *ipsum* dolor sit _amet_'
    //     )
    //   })
    // }
  })
})
