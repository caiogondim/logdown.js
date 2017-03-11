<img src="http://rawgit.com/caiogondim/logdown.js/master/img/icon.svg">

<h1 align="center">logdown.js</h1>

<div align="center">
<img src="http://travis-ci.org/caiogondim/logdown.js.svg?branch=master" alt="Travis CI"> <img src="http://img.badgesize.io/caiogondim/logdown.js/master/dist/logdown.min.js?compression=gzip" alt="lib size"> <img src="http://img.shields.io/npm/dm/logdown.svg" alt="Downloads per month">
</div>

<br>

Logdown is a debug utility for the browser and the server with Markdown support.
It does not have any dependencies and is only 2K gzipped.

You can see it in action in the [example page](//caiogondim.github.io/logdown.js)
or in the preview below.


## Preview

### Browser
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/browser-preview.gif">

### Server
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/node-preview.gif">


## Installation

### npm

If on the server, install it through [npm](https://www.npmjs.com/):

```bash
npm install --save logdown
```

```js
const Logdown = require('logdown')
const logger = logdown('foo')
```

Or as a more idiomatic way:

```js
const logger = require('logdown')('foo')
```

### Bower

In the browser you can install it through [Bower](http://bower.io):

```bash
bower install logdown
```

```js
const logger = require('logdown')('foo')
```

### Other

You can also use the lib in the browser in the same way as in the server if you use [Browserify](http://browserify.org/). Or you can just download it [here](https://github.com/caiogondim/logdown.js/archive/master.zip) and put the `dist/logdown.js` file in your public folder. Another way of retrieving Logdown is [via jsDelivr](http://www.jsdelivr.com/projects/logdown.js), a public Open Source CDN.

## Import

### SystemJS

Using the dynamic module loader [SystemJS](https://github.com/systemjs/systemjs), Logdown can be loaded as a CommonJS module:

```js
SystemJS.config({
  map: {
    'logdown': 'bower_components/logdown/dist/logdown.js'
  },
  packages: {
    'logdown': {format: 'cjs'}
  }
});
```

```js
System.import('logdown').then(function(Logdown) {
  const logger = logdown('foo')
});
```

### TypeScript

```ts
import Logdown = require('logdown');
```

```ts
const logger: Logdown = new Logdown('foo');
```

## Usage

### Logging

It is highly recommended to use a prefix for your instance, this way you get a nice prefixed message on console and it is possible to silence instances based on the prefix name, as we will see after.

After creating your object, you can use the regular `log`, `warn`, `info` and `error` methods as we have on `console`, but now with Markdown support.

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

**Example**

```js
const options = {alignOutput: true, prefix: 'foo'}
const logger = new Logdown(options)
```

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
var fooBarLogger = Logdown('foo:bar')
fooBarLogger.log('Lorem ipsum')

var fooQuzLogger = Logdown('foo:quz')
fooQuzLogger.log('Lorem Ipsum')
```

#### `markdown`

- Type: 'Boolean'
- Default: `true`

If setted to `false`, markdown will not be parsed.

```js
var logger = Logdown({markdown: false})
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

#### `alignOutput`

- Type: 'Boolean'
- Default: `false`

If setted to `true`, the name of the logger instance will have the same length as the longest name of any other Logdown instance.

## Enabling/disabling instances

It is possible to enable/disable the output of instances using the
`Logdown.disable` or `Logdown.enable` methods.

```js
Logdown.disable('foo') // will disable the instance with *foo* prefix
Logdown.enable('bar') // will enable the instance with *bar* prefix
```

You can also use wildcards.

```js
Logdown.enable('*') // enables all instances
Logdown.disable('*') // disables all instances
Logdown.enable('foo*') // enables all instances with a prefix starting with *foo*
```

Use `-` to do a negation.

```js
// enables all instances but the one with *foo* prefix
Logdown.enable('*', '-foo')
// disables all intances with foo in the prefix, but don't disable *foobar*
Logdown.disable('*foo*', '-foobar')
```

## Credits
- Moleskine icon by [Monika Ciapala](http://thenounproject.com/merdesign/)
- Markdown icon by [Dustin Curtis](https://github.com/dcurtis/markdown-mark)


## Contributors

```
203	Caio Gondim
 30	Benny Neugebauer
  5	David Godfrey
  2	Sven Anders Robbestad
  1	Dan Lukinykh
  1	Bent Cardan
  1	Gleb Bahmutov
  1	Panayiotis Lipiridis
  1	netmml
```

## Donating

If you found this library useful and are willing to donate, transfer some
bitcoins to `1BqqKiZA8Tq43CdukdBEwCdDD42jxuX9UY` or through the
[URL](https://www.coinbase.com/caiogondim) https://www.coinbase.com/caiogondim

Or via [PayPal.me](https://www.paypal.me/caiogondim) https://www.paypal.me/caiogondim.

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
