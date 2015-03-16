/* global describe, afterEach, beforeEach, console, it, require, window,
global, Logdown, chai, sinon, xit */
/* jshint -W038 */
/* jshint unused:false */

;(function(global) {
  'use strict';

  // if (typeof require === 'function') {
  //   var chai = require('chai')
  //   var sinon = require('sinon')
  //   var Logdown = require('../src/index')
  // }

  sinon.assert.expose(chai.assert, {prefix: ''})
  var assert = chai.assert

  // if (typeof global === 'undefined') {
  //   var global = window
  // }

  function createInstances() {
    return [
      new Logdown({prefix: 'foo'}),
      new Logdown({prefix: 'bar'}),
      new Logdown({prefix: 'quz'}),
      new Logdown({prefix: 'baz'})
    ]
  }

  // function mockWebkitEnviroment() {
  //   global.document = {}
  //   global.document.documentElement = {}
  //   global.document.documentElement.style = {}
  //   global.document.documentElement.style = {'WebkitAppearance': null}
  //   global.window = {}
  //   global.window.document = global.document

  //   global.navigator = {}
  //   global.navigator.userAgent = 'Lorem'
  // }
  // mockWebkitEnviroment()

  // function mockIEEnviroment() {
  //   global.document = {}
  //   global.document.documentElement = {}
  //   global.document.documentElement.style = {}
  //   global.window = {}
  //   global.window.document = global.document

  //   global.navigator = {}
  //   global.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 8.0; ' +
  //                                'Windows NT 6.1; Trident/4.0; GTB7.4; ' +
  //                                'InfoPath.2; SV1; .NET CLR 3.3.69573; ' +
  //                                'WOW64; en-US)'
  // }

  // function unmockBrowserEnviroment() {
  //   delete global.window
  //   delete global.document
  //   delete global.navigator
  // }

  describe('new Logdown()', function() {
    it('should return an existing instance if the prefix is already in use',
       function() {
      var foo = new Logdown({prefix: 'foo'})
      var foo2 = new Logdown({prefix: 'foo'})
      assert.equal(foo, foo2)
    })

    it('should give a new prefix color for each instance', function() {
      var foo = new Logdown({prefix: 'foo'})
      var bar = new Logdown({prefix: 'bar'})
      var quz = new Logdown({prefix: 'quz'})
      var baz = new Logdown({prefix: 'baz'})
      assert.notEqual(foo.prefixColor, bar.prefixColor)
      assert.notEqual(foo.prefixColor, quz.prefixColor)
      assert.notEqual(foo.prefixColor, baz.prefixColor)
    })

    it('should sanitize prefixes name', function() {
      var log1 = new Logdown({prefix: '%cfoo%c'})
      assert.equal(log1.prefix, 'foo')

      var log2 = new Logdown({prefix: '%cba%cr'})
      assert.equal(log2.prefix, 'bar')
    })
  })

  describe('Logdown.enable', function() {
    var sandbox

    beforeEach(function() {
      sandbox = sinon.sandbox.create()

      sandbox.stub(global.console, 'log')
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('`(\'*\')` should enable all instances', function() {
      try {
        Logdown.disable('*')
        Logdown.enable('*')
        var instances = createInstances()
        instances.forEach(function(instance) {
          instance.log('Lorem')
        })

        assert.called(console.log)
        sandbox.restore()
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it(
      '`(\'foo\')` should enable only instances with “foo” prefix',
      function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var quz = new Logdown({prefix: 'quz'})
        var baz = new Logdown({prefix: 'baz'})

        Logdown.disable('*')
        Logdown.enable('foo')

        bar.log('lorem')
        assert.notCalled(console.log)
        quz.log('lorem')
        assert.notCalled(console.log)
        baz.log('lorem')
        assert.notCalled(console.log)
        foo.log('lorem')
        assert.called(console.log)

        sandbox.restore()
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*foo\')` should enable only instances with names ending with “foo”',
       function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.disable('*')
        Logdown.enable('*foo')

        bar.log('lorem')
        foobar.log('lorem')
        assert.notCalled(console.log)
        foo.log('lorem')
        barfoo.log('lorem')
        assert.calledTwice(console.log)

        sandbox.restore()
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'foo*\')` should enable only instances with names ' +
       'beginning with “foo”', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.disable('*')
        Logdown.enable('foo*')

        bar.log('lorem')
        barfoo.log('lorem')
        assert.notCalled(console.log)
        foobar.log('lorem')
        foo.log('lorem')
        assert.calledTwice(console.log)

        sandbox.restore()
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'-*\')` should disable all instances', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.enable('-*')

        foobar.log('lorem')
        foo.log('lorem')
        bar.log('lorem')
        barfoo.log('lorem')
        assert.notCalled(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*\', \'-foo\')` should enable all but only instances ' +
       'with “foo” prefix', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var quz = new Logdown({prefix: 'quz'})
        var baz = new Logdown({prefix: 'baz'})

        Logdown.enable('*', '-foo')

        foo.log('lorem')
        assert.notCalled(console.log)
        bar.log('lorem')
        quz.log('lorem')
        baz.log('lorem')
        assert.calledThrice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*\', \'-*foo\')` should enable all but instances with names ' +
       'ending with “foo”', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.enable('*', '-*foo')

        foo.log('lorem')
        barfoo.log('lorem')
        assert.notCalled(console.log)
        bar.log('lorem')
        foobar.log('lorem')
        assert.calledTwice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*\', \'-foo*\')` should enable all but instances with names ' +
       'beginning with “foo”', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.enable('*', '-foo*')

        foobar.log('lorem')
        foo.log('lorem')
        assert.notCalled(console.log)
        bar.log('lorem')
        barfoo.log('lorem')
        assert.calledTwice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('should accept N arguments', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.disable('*')
        Logdown.enable('foo', 'barfoo')

        bar.log('lorem')
        foobar.log('lorem')
        assert.notCalled(console.log)
        foo.log('lorem')
        barfoo.log('lorem')
        assert.calledTwice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })
  })

  describe('Logdown.disable', function() {
    var sandbox

    beforeEach(function() {
      sandbox = sinon.sandbox.create()

      sandbox.stub(global.console, 'log')
    })

    it('`(\'*\')` should disable all instances', function() {
      Logdown.enable('*')
      Logdown.disable('*')
      var instances = createInstances()
      instances.forEach(function(instance) {
        instance.log('Lorem')
      })

      assert.notCalled(console.log)

      sandbox.restore()
    })

    it('`(\'foo\')` should disable only instances with “foo” prefix',
       function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var quz = new Logdown({prefix: 'quz'})
        var baz = new Logdown({prefix: 'baz'})

        Logdown.enable('*')
        Logdown.disable('foo')

        foo.log('lorem')
        assert.notCalled(console.log)
        bar.log('lorem')
        quz.log('lorem')
        baz.log('lorem')
        assert.calledThrice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*foo\')` should disable only instances with names ending' +
       'with “foo”', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.enable('*')
        Logdown.disable('*foo')

        foo.log('lorem')
        barfoo.log('lorem')
        assert.notCalled(console.log)
        bar.log('lorem')
        foobar.log('lorem')
        assert.calledTwice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'foo*\')` should disable only instances with names beginning ' +
       'with “foo”', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.enable('*')
        Logdown.disable('foo*')

        foobar.log('lorem')
        foo.log('lorem')
        assert.notCalled(console.log)
        bar.log('lorem')
        barfoo.log('lorem')
        assert.calledTwice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*\')` should disable all instances', function() {
      try {
        Logdown.enable('*')
        Logdown.disable('*')
        var instances = createInstances()
        instances.forEach(function(instance) {
          instance.log('Lorem')
        })

        assert.notCalled(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'foo\')` should disable only instances with ' +
       '“foo” prefix', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var quz = new Logdown({prefix: 'quz'})
        var baz = new Logdown({prefix: 'baz'})

        Logdown.enable('*')
        Logdown.disable('foo')

        foo.log('lorem')
        assert.notCalled(console.log)
        bar.log('lorem')
        quz.log('lorem')
        baz.log('lorem')
        assert.calledThrice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*\', \'-*foo\')` should disable all but instances with names ' +
       'ending with “foo”', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.disable('*', '-*foo')

        bar.log('lorem')
        foobar.log('lorem')
        assert.notCalled(console.log)
        foo.log('lorem')
        barfoo.log('lorem')
        assert.calledTwice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*\', \'-foo*\')` should disable all but instances with names ' +
       'beginning with “foo”', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.disable('*', '-foo*')

        bar.log('lorem')
        barfoo.log('lorem')
        assert.notCalled(console.log)
        foobar.log('lorem')
        foo.log('lorem')
        assert.calledTwice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'-*\')` should not disable any instances', function() {
      try {
        Logdown.disable('-*')
        var instances = createInstances()
        instances.forEach(function(instance) {
          instance.log('Lorem')
        })
        assert.callCount(console.log, 4)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('`(\'*\', \'-foo\')` should disable all but instances with “foo” prefix',
       function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var quz = new Logdown({prefix: 'quz'})
        var baz = new Logdown({prefix: 'baz'})

        Logdown.disable('*', '-foo')

        bar.log('lorem')
        quz.log('lorem')
        baz.log('lorem')
        assert.notCalled(console.log)
        foo.log('lorem')
        assert.calledOnce(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })

    it('should accept N arguments', function() {
      try {
        var foo = new Logdown({prefix: 'foo'})
        var bar = new Logdown({prefix: 'bar'})
        var foobar = new Logdown({prefix: 'foobar'})
        var barfoo = new Logdown({prefix: 'barfoo'})

        Logdown.enable('*')
        Logdown.disable('foo', 'barfoo')

        foo.log('lorem')
        barfoo.log('lorem')
        assert.notCalled(console.log)
        bar.log('lorem')
        foobar.log('lorem')
        assert.calledTwice(console.log)
      } catch (error) {
        sandbox.restore()
        throw error
      }

      sandbox.restore()
    })
  })

  var methods = ['log', 'info', 'warn', 'error']
  methods.forEach(function(method) {
    describe('Logdown::' + method, function() {
      var sandbox

      beforeEach(function() {
        sandbox = sinon.sandbox.create()
        sandbox.stub(global.console, method)
      })

      afterEach(function() {
        sandbox.restore()
      })

      it('should parse markdown if enabled', function() {
        try {
          var foo = new Logdown({markdown: true})

          foo[method]('lorem *ipsum*')
          assert.calledWith(
            console[method],
            'lorem %cipsum%c',
            'font-weight:bold;',
            'color:inherit;'
          )

          foo[method]('lorem _ipsum_')
          assert.calledWith(
            console[method],
            'lorem %cipsum%c',
            'font-style:italic;',
            'color:inherit;'
          )

          foo[method]('lorem `ipsum`')
          assert.calledWith(
            console[method],
            'lorem %cipsum%c',
            'background:#FDF6E3; color:#586E75; padding:1px 5px; ' +
              'border-radius:4px;',
            'color:inherit;'
          )

          foo[method]('lorem `ipsum` *dolor* sit _amet_')
          assert.calledWith(
            console[method],
            'lorem %cipsum%c %cdolor%c sit %camet%c',
            'background:#FDF6E3; color:#586E75; padding:1px 5px; ' +
              'border-radius:4px;',
            'color:inherit;',
            'font-weight:bold;',
            'color:inherit;',
            'font-style:italic;',
            'color:inherit;'
          )
        } catch (error) {
          sandbox.restore()
          throw error
        }

        sandbox.restore()
      })

      it('should not parse markdown if disabled', function() {
        try {
          var foo = new Logdown({markdown: false})

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

      it('should sanitize forbidden characters', function() {
        sandbox.restore()
      })

      it('should print prefix if present', function() {
        // var foo = new Logdown({prefix: 'foo'})

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

      it('should sanitize strings', function() {
        try {
          var foo = new Logdown()
          foo[method]('lorem %cipsum%c sit %cdolor%c amet')
          assert.calledWith(console[method], 'lorem ipsum sit dolor amet')

          // var bar = new Logdown({prefix: 'bar'})
          // bar.log('lorem %cipsum% sit %cdolor% amet')
          // assert.calledWith(
          //   console[method],
          //   '%c' + bar.prefix + '%clorem ipsum sit dolor amet',
          //   'color:' + bar.prefixColor + '; font-weight:bold;',
          //   ''
          // )
        } catch (error) {
          sandbox.restore()
          throw error
        }

        sandbox.restore()
      })

      // https://github.com/caiogondim/logdown/issues/14
      xit('should print not-string arguments as is', function() {
        try {
          var foo = new Logdown()
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

      //     var bar = new Logdown()
      //     bar[method]('lorem *ipsum* dolor sit _amet_')
      //     assert.calledWith(
      //       console[method],
      //       'lorem *ipsum* dolor sit _amet_'
      //     )

      //     var foo = new Logdown({prefix: 'foo'})
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

      //     var bar = new Logdown()
      //     bar[method]('lorem *ipsum* dolor sit _amet_')
      //     assert.calledWith(
      //       console[method],
      //       'lorem *ipsum* dolor sit _amet_'
      //     )
      //   })
      // }
    })
  })
}(typeof global === 'undefined' ? window : global));
