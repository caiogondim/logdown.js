/* global describe, it, beforeEach, afterEach */

var chai = require('chai')
var sinon = require('sinon')
var logdown = require('../../src/index')
var ansiColors = require('../../src/util/ansi-colors')

sinon.assert.expose(chai.assert, {prefix: ''})
var assert = chai.assert

var methods = ['debug', 'log', 'info', 'warn', 'error']
methods.forEach(function (method) {
  describe('logdown::' + method, function () {
    var sandbox
    var symbol = ''

    if (method === 'debug') {
      symbol =
        '\u001b[' + ansiColors.colors.gray[0] + 'm' +
        '🐞 ' +
        '\u001b[' + ansiColors.colors.gray[1] + 'm '
    } else if (method === 'info') {
      symbol =
        '\u001b[' + ansiColors.colors.blue[0] + 'm' +
        'ℹ️ ' +
        '\u001b[' + ansiColors.colors.blue[1] + 'm '
    } else if (method === 'warn') {
      symbol =
        '\u001b[' + ansiColors.colors.yellow[0] + 'm' +
        '⚠️ ' +
        '\u001b[' + ansiColors.colors.yellow[1] + 'm '
    } else if (method === 'error') {
      symbol =
        '\u001b[' + ansiColors.colors.red[0] + 'm' +
        '❌ ' +
        '\u001b[' + ansiColors.colors.red[1] + 'm '
    }

    beforeEach(function () {
      global.console[method] = global.console[method] || global.console.log
      sandbox = sinon.sandbox.create()
      sandbox.stub(global.console, method)

      logdown.enable('*')
      process.env.NODE_DEBUG = ''
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('should output multiple arguments', function () {
      try {
        var foo = logdown({markdown: true})

        foo[method]('one', 'two', 'three')

        var args = [
          symbol,
          'one',
          'two',
          'three'
        ]

        if (method === 'log') {
          assert.calledWith(
            console[method],
            args[1],
            args[2],
            args[3]
          )
        } else {
          assert.calledWith(
            console[method],
            args[0],
            args[1],
            args[2],
            args[3]
          )
        }
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('should parse markdown in multiple arguments', function () {
      try {
        var foo = logdown({markdown: true})

        var args = [
          symbol,
          'one',
          '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
          'two' +
          '\u001b[' + ansiColors.modifiers.bold[1] + 'm',
          'three'
        ]

        foo[method]('one', '*two*', 'three')

        if (method === 'log') {
          assert.calledWith(
            console[method],
            args[1]
          )
        } else {
          assert.calledWith(
            console[method],
            args[0],
            args[1]
          )
        }
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('should parse markdown if enabled', function () {
      try {
        logdown._instances = []
        const foo = logdown({ markdown: true })

        const args1 = [
          symbol,
          'lorem ' +
          '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
          'ipsum' +
          '\u001b[' + ansiColors.modifiers.bold[1] + 'm'
        ]

        foo[method]('lorem *ipsum*')

        if (method === 'log') {
          assert.calledWith(
            console[method],
            args1[1]
          )
        } else {
          assert.calledWith(
            console[method],
            args1[0],
            args1[1]
          )
        }

        const args2 = [
          symbol,
          'lorem ' +
          '\u001b[' + ansiColors.modifiers.italic[0] + 'm' +
          'ipsum' +
          '\u001b[' + ansiColors.modifiers.italic[1] + 'm'
        ]

        foo[method]('lorem _ipsum_')

        if (method === 'log') {
          assert.calledWith(
            console[method],
            args2[1]
          )
        } else {
          assert.calledWith(
            console[method],
            args2[0],
            args2[1]
          )
        }

        const args3 = [
          symbol,
          'lorem ' +
          '\u001b[' + ansiColors.colors.yellow[0] + 'm' +
          'ipsum' +
          '\u001b[' + ansiColors.colors.yellow[1] + 'm'
        ]

        foo[method]('lorem `ipsum`')

        if (method === 'log') {
          assert.calledWith(
            console[method],
            args3[1]
          )
        } else {
          assert.calledWith(
            console[method],
            args3[0],
            args3[1]
          )
        }
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('should not parse markdown if disabled', function () {
      try {
        logdown._instances = []
        const foo = logdown({ markdown: false })

        const args1 = [
          symbol,
          'lorem *ipsum*'
        ]

        foo[method]('lorem *ipsum*')

        if (method === 'log') {
          assert.calledWith(
            console[method],
            args1[1]
          )
        } else {
          assert.calledWith(
            console[method],
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
          assert.calledWith(
            console[method],
            args2[1]
          )
        } else {
          assert.calledWith(
            console[method],
            args2[0],
            args2[1]
          )
        }
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('can add whitespace to align logger output', function () {
      try {
        var abc = logdown('abc')
        var text = logdown('text', { alignOutput: 'yes' })
        var demo = logdown('demo', { alignOutput: true })
        var longDemo = logdown('longDemo', { alignOutput: true })
        var demoFalse = logdown('demoFalse', { alignOutput: false })
        var longerDemo = logdown('longerDemo', { alignOutput: true })

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
    it('should print not-string arguments as is', function () {
      try {
        var foo = logdown('foo')
        var obj = {bar: 2, foo: 1}
        foo[method](obj)
        assert.calledWith(
          console[method],
          symbol +
          '\u001b[' + foo.opts.prefixColor[0] + 'm' +
          '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
          foo.opts.prefix +
          '\u001b[' + ansiColors.modifiers.bold[1] + 'm' +
          '\u001b[' + foo.opts.prefixColor[1] + 'm',
          obj
        )
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })
  })
})
