<img src="http://rawgit.com/caiogondim/logdown.js/master/img/icon.svg">

<h1 align="center">logdown.js</h1>

<div align="center">
<img src="http://travis-ci.org/caiogondim/logdown.js.svg?branch=master" alt="Travis CI"> <img src="http://img.badgesize.io/caiogondim/logdown.js/master/dist/logdown.min.js?compression=gzip" alt="lib size"> <img src="http://img.shields.io/npm/dm/logdown.svg" alt="Downloads per month">
</div>

<br>

#### THIS VERSION (v3) IS UNDER DEVELOPMENT

logdown is a debug utility for the browser and the server with Markdown support, providing a single interface and a similar behavior between the browser and the server.

It doesn't have any dependencies for the browser version and it is less than 2K gzipped.

You can see it in action in the [example page](//caiogondim.github.io/logdown.js) or in the preview
below.

## Preview

Out-of-the box colors work well on both light and dark themes.

<h3 align="center">Browser DevTools dark</h3>
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/browser-preview-dark.png">

<h3 align="center">Browser DevTools light</h3>
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/browser-preview-light.png">

<h3 align="center">Node</h3>
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/node-preview.png">

## Installation

```bash
$ npm install --save logdown
```

## Usage

`logdown` exports a function. For the simplest use case, pass the name of your module and
it will return a decorated `console`.

```js
const logdown = require('logdown')
const logger = logdown('foo')
```

Or in a more idiomatic way:

```js
const logger = require('logdown')('foo')
```

Just like [debug.js](https://github.com/visionmedia/debug) and node core's [debuglog](https://nodejs.org/docs/latest/api/util.html#util_util_debuglog_section), the enviroment variable `NODE_DEBUG` is used to decide which
module will print debug information.

```js
$ NODE_DEBUG=foo node example/node.js
```

### Logging

After creating your object, you can use the regular `log`, `warn`, `info` and `error` methods as we
have on `console`, but now with Markdown support. If a method is not provided by `logdown`, it will
just delegate to the original `console` object or `opts.logger` if passed.

```js
logger.log('lorem *ipsum*')
logger.info('dolor _sit_ amet')
logger.warn('consectetur `adipiscing` elit')
```

As the native APIs, multiple arguments are supported.

```js
logger.log('lorem', '*ipsum*')
logger.info('dolor _sit_', 'amet')
logger.warn('consectetur', '`adipiscing` elit')
```

### Options

The following options can be used for configuration.

#### `prefix`

- Type: `String`

```js
const logger = logdown({ prefix: 'foo' })
logger.log('Lorem ipsum') // Will use console.log with a prefix
```

The above code is the same as:
```js
const logger = logdown('foo')
logger.log('Lorem ipsum')
```

You should use the name of your module.
You can, also, use `:` to separate modules inside one big module.

```js
var fooBarLogger = logdown('foo:bar')
fooBarLogger.log('Lorem ipsum')

var fooQuzLogger = logdown('foo:quz')
fooQuzLogger.log('Lorem Ipsum')
```

#### `markdown`

- Type: `Boolean`
- Default: `true`

If setted to `false`, markdown will not be parsed.

```js
var logger = logdown({markdown: false})
logger.log('Lorem *ipsum*') // Will not parse the markdown
```

For Markdown, the following mark-up is supported:

```js
// Bold with "*"" between words
logger.log('lorem *ipsum*')

// Italic with "_" between words
logger.log('lorem _ipsum_')

// Code with ` (backtick) between words
logger.log('lorem `ipsum`')
```

#### `prefixColor`

- type: `String`
- default: next value after last used on the `logdown.prefixColors` array.

Hex value for a custom color.

```js
const logger1 = logdown('foo', { prefixColor: '#FF0000'}) // red prefix
const logger2 = logdown('bar', { prefixColor: '#00FF00'}) // green prefix
const logger3 = logdown('quz', { prefixColor: '#0000FF'}) // blue prefix
```

#### `logger`

- type: 'Object'
- default: `console`

Custom logger. On Node it's possible to instantiate a new `console` setting it's output to a
different stream other than `stdout` and `stderr`.

```js
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
const fileLogger =  new Console(output, errorOutput)

const logger = logdown('foo', {
  logger: fileLogger
})
```

## State

### `isEnabled`

- type: 'Boolean'
- default: default value is derived from `localStorage.debug` on browser and from env var `NODE_DEBUG` on node.

Used to enable/disable a given instance at runtime.

```js
// Prevents `logger` to output debug info
logger.state.isEnabled = false
```

## Enabling/disabling instances

logdown is compatible with Node.js
[util.debuglog](https://nodejs.org/docs/latest/api/util.html#util_util_debuglog_section) and
[debug.js](https://github.com/visionmedia/debug) as it uses the `NODE_DEBUG` enviroment variable to
control which instances are enabled to output debug info.

```bash
NODE_DEBUG=foo node foo.js // will disable the instance with *foo* prefix
```

Multiple instances should be separated by comma

```bash
NODE_DEBUG=foo,bar node foo.js // will disable the instance with *foo* prefix
```

### Wildcards

You can also use wildcards.

```js
logdown.enable('*') // enables all instances
logdown.disable('*') // disables all instances
logdown.enable('foo*') // enables all instances with a prefix starting with *foo*
```

Use `-` to do a negation.

```js
// enables all instances but the one with *foo* prefix
logdown.enable('*', '-foo')
// disables all intances with foo in the prefix, but don't disable *foobar*
logdown.disable('*foo*', '-foobar')
```

## Conventions

If you're using this in one or more of your libraries, you should use the name of your library so
that developers may toggle debugging as desired without guessing names. If you have more than one
debuggers you should prefix them with your library name and use ":" to separate features. For
example "bodyParser" from Connect would then be "connect:bodyParser".

## FAQ

### Disabling one method on an instance at runtime
```js
// To disable a given method, just pass a no-op to it
logger.warn = function() {}

// To reenable, attach it again to the prototype
logger.warn = logdown.prototype.warn
```

### Align prefixes

If you want to align the output of each instance, like the example below:
```
[ipsum]   lorem
[sitamet] lorem
[dolor]   lorem
```

Use the the following function
```js
function alignPrefixes(Logdown) {
  var longest = logdown._instances.sort(function (a, b) {
    return b.opts.prefix.length - a.opts.prefix.length
  })[0]

  logdown._instances
    .forEach(function (instance) {
      var padding = new Array(Math.max(longest.opts.prefix.length - instance.opts.prefix.length + 1, 0)).join(' ')
      instance.opts.prefix = instance.opts.prefix + padding
    })
}
```

### Enable/disable instance at runtime

Set the instance state `isEnabled` to false to prevent it to log.

```js
logger.state.isEnabled = false
```

If you don't have direct access to the instance, use `logdown.getInstanceByPrefix` to get an instance reference.

```js
const logger = logdown.getInstanceByPrefix('foo')
logger.state.isEnabled = false
```

## Sponsor

If you found this library useful and are willing to donate, transfer some
bitcoins to `1BqqKiZA8Tq43CdukdBEwCdDD42jxuX9UY`.

## Credits

- [debug.js](https://github.com/visionmedia/debug) for some pieces of copied documentation
- [Node core's debuglog](https://nodejs.org/docs/latest/api/util.html#util_util_debuglog_section)

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
