<img src="http://rawgit.com/caiogondim/logdown.js/master/img/icon.svg">

<h1 align="center">logdown.js</h1>

<div align="center">
<img src="http://travis-ci.org/caiogondim/logdown.js.svg?branch=master" alt="Travis CI"> <img src="http://img.badgesize.io/caiogondim/logdown.js/master/dist/logdown.min.js?compression=gzip" alt="lib size"> <img src="http://img.shields.io/npm/dm/logdown.svg" alt="Downloads per month">
</div>

<br>

logdown is a debug utility for the browser and the server with Markdown support.
It doesn't have dependencies and is less than 2K gzipped.

<a href="https://github.com/caiogondim/abstract-debug.js"><img src="https://github.com/caiogondim/abstract-debug.js/raw/master/img/badge@2x.png" width="190" alt="abstract debug badge" /></a>

You can see it in action in the [example page](//caiogondim.github.io/logdown.js) or in the preview
below.

## Preview

### Browser
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/browser-preview.gif">

### Server
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/node-preview.gif">

## Installation

```bash
npm install --save logdown
```

```js
const logdown = require('logdown')
const logger = logdown('foo')
```

Or in a more idiomatic way:

```js
const logger = require('logdown')('foo')
```

## Usage

### Logging

It is highly recommended to use a prefix for your instance, this way you get a nice prefixed message
on console and it is possible to silence instances based on the prefix name, as we will see after.

After creating your object, you can use the regular `log`, `warn`, `info` and `error` methods as we
have on `console`, but now with Markdown support.

```js
logger.log('lorem *ipsum*')
logger.info('dolor _sit_ amet')
logger.warn('consectetur `adipiscing` elit')
```

You can pass multiple arguments

```js
logger.log('lorem', '*ipsum*')
logger.info('dolor _sit_', 'amet')
logger.warn('consectetur', '`adipiscing` elit')
```

### Options

The constructor accepts one object for configuration on instantiation time.

The following options can be used for configuration.

#### `prefix`

- Type: 'String'
- Default: `''`

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

- Type: 'Boolean'
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

## Enabling/disabling instances

It is possible to enable/disable the output of instances using the
`logdown.disable` or `logdown.enable` methods.

```js
logdown.disable('foo') // will disable the instance with *foo* prefix
logdown.enable('bar') // will enable the instance with *bar* prefix
```

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

## Recipes

### Disabling logging on an instance level
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
  var longest = Logdown._instances.sort(function (a, b) {
    return b.opts.prefix.length - a.opts.prefix.length
  })[0]

  Logdown._instances
    .forEach(function (instance) {
      var padding = new Array(Math.max(longest.opts.prefix.length - instance.opts.prefix.length + 1, 0)).join(' ')
      instance.opts.prefix = instance.opts.prefix + padding
    })
}
```

## Sponsor

If you found this library useful and are willing to donate, transfer some
bitcoins to `1BqqKiZA8Tq43CdukdBEwCdDD42jxuX9UY`.

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
