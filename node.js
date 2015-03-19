'use strict'

var Logdown = require('../')

var demo = new Logdown({prefix: 'demo'})

var gap = 2000
var i = 1
var timeout

demo.log('Initializing demo')

timeout = i * gap
i += 1
setTimeout(function() {
  var log1 = new Logdown({prefix: 'foo:bar'})
  log1.log('Lorem *ipsum* dolor sit _amet_ foo bar')
  log1.warn('The method `foo()` is deprecated. You should use `bar()`')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  var log2 = new Logdown({prefix: 'foo:quz'})
  log2.log('Lorem *ipsum* dolor sit _amet_ foo bar')
  log2.warn('The method `foo()` is deprecated. You should use `bar()`')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  var log3 = new Logdown({prefix: 'baz'})
  log3.info('Sit viderer eripuit tincidunt an')
  log3.error('The method `dolor()` is no longer supported.')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  var log4 = new Logdown({prefix: 'corge'})
  log4.log('Id ius atqui interpretaris. Usu ea *dolor* alterum labores')
  log4.warn('Simul *nonumes* qui ei.')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  var log4 = new Logdown({prefix: 'grault'})
  log4.log('Molestie nominati _recteque_ no eam, qui *ei* putant delicatissi')
  log4.log('Cum at delenit *apeirian* forensibus.')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  var log6 = new Logdown({prefix: 'waldo'})
  log6.log('Molestie nominati _recteque_ no eam, qui *ei* putant delicatissi')
  log6.log('Cum at delenit *apeirian* forensibus.')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  demo.log('Demo finished')
}, timeout)
