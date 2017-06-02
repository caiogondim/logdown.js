var logdown = require('../src/node')

var demo = logdown('demo')

var gap = 2000
var i = 1
var timeout

demo.log('Initializing demo')

timeout = i * gap
i += 1
setTimeout(function() {
  var log1 = logdown('foo:bar')
  log1.log('Lorem *ipsum* dolor sit _amet_ foo bar')
  log1.info('The method `foo()` is deprecated. You should use `bar()`')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  var log2 = logdown('foo:quz')
  log2.log('Lorem *ipsum* dolor sit _amet_ foo bar')
  log2.warn('The method `foo()` is deprecated. You should use `bar()`')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  var log3 = logdown('baz')
  log3.log('Sit viderer eripuit tincidunt an')
  log3.error('The method `dolor()` is no longer supported.')
}, timeout)

timeout = i * gap
i += 1
setTimeout(function() {
  demo.log('Demo finished')
}, timeout)
