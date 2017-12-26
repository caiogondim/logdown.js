const logdown = require('../src/node')

const demo = logdown('demo')

demo.log('Initializing demo')

const log1 = logdown('foo:bar')
log1.log('Lorem *ipsum* dolor sit _amet_ foo bar')
log1.info('The method `foo()` is deprecated. You should use `bar()`')

const log2 = logdown('foo:quz')
log2.log('Lorem *ipsum* dolor sit _amet_ foo bar')
log2.warn('The method `foo()` is deprecated. You should use `bar()`')

const log3 = logdown('baz')
log3.log('Sit viderer eripuit tincidunt an')
log3.error('The method `dolor()` is no longer supported.')

demo.log('Demo finished')
