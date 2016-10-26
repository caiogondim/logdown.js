<img src="http://rawgit.com/caiogondim/logdown.js/master/img/icon.svg">

# logdown.js

<img src="http://travis-ci.org/caiogondim/logdown.js.svg?branch=master" alt="Travis CI"> <img src="http://img.badgesize.io/caiogondim/logdown.js/master/dist/index.js?compression=gzip" alt="lib size"> <img src="https://david-dm.org/caiogondim/logdown.js/status.svg" alt="dependencies status"> <img src="http://img.shields.io/npm/dm/logdown.svg" alt="Downloads per month"> [![Slack Status](http://logdown-slack.herokuapp.com/badge.svg)](https://logdown-slack.herokuapp.com/)

Logdown is a debug utility for the browser and the server with Markdown support.
It does not have any dependencies and is only 2K gzipped.

You can see it in action in the [example page](//caiogondim.github.io/logdown.js)
or in the preview below.


## Preview

### Browser
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/browser-preview.gif">

### Server
<img src="http://rawgit.com/caiogondim/logdown.js/master/img/node-preview.gif">


## Using

The simplest use of the library in both platforms could be done as follows:

### Node.js

If on the server, install it through [npm](https://www.npmjs.com/):

```bash
npm install --save logdown
```

```js
var Logdown = require('logdown')
var logger = new Logdown({prefix: 'foo'})
```

### Browser

In the browser you can install it through [Bower](http://bower.io).

```bash
bower install logdown
```

```js
var logger = new Logdown({prefix: 'foo'})
```

### SystemJS

Using the dynamic module loader [SystemJS](https://github.com/systemjs/systemjs), Logdown can be loaded as a CommonJS module.

```js
SystemJS.config({
  map: {
    'logdown': 'bower_components/logdown/dist/index.js'
  },
  packages: {
    'logdown': {format: 'cjs'}
  }
});
```

```js
System.import('logdown').then(function(Logdown) {
  var logger = new Logdown({prefix: 'foo'}
});
```

### Other

You can also use the lib in the browser in the same way as in the server if you
use [Browserify](http://browserify.org/). Or you can just download it
[here](https://github.com/caiogondim/logdown.js/archive/master.zip) and put the
`dist/index.js` file in your public folder.

### Usage

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

### New objects

The constructor accepts one object for configuration on instantiation time.

#### `opts.prefix`

Type: 'String'

Default: `''`

```js
var logger = new Logdown({prefix: 'foo'})
logger.log('Lorem ipsum') // Will use console.log with a prefix
```

You should use the name of your module.
You can, also, use `:` to separate modules inside one big module.

```js
var fooBarLogger = new Logdown({prefix: 'foo:bar'})
fooBarLogger.log('Lorem ipsum')

var fooQuzLogger = new Logdown({prefix: 'foo:quz'})
fooQuzLogger.log('Lorem Ipsum')
```

#### `opts.markdown`

Type: 'Boolean'

Default: `true`

If setted to `false`, markdown will not be parsed.

```js
var logger = new Logdown({markdown: false})
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


## Support

### Desktop browsers

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) |  ![Edge](https://raw.github.com/alrra/browser-logos/master/edge/edge_48x48.png) |  ![Brave](https://raw.github.com/alrra/browser-logos/master/brave/brave_48x48.png) |
| --- | --- | --- | --- | --- | --- | --- |
| Latest | 9+ | Latest | Latest | Latest | Latest | Latest |

### Mobile browsers

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari-ios/safari-ios_48x48.png) | ![Android Browser](https://raw.github.com/alrra/browser-logos/master/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) |  ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![UC](https://raw.github.com/alrra/browser-logos/master/uc/uc_48x48.png) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Latest | 6+ | 4.0+ | 8+ | Latest | Latest | Latest |

### Server

| <a href="https://nodejs.org"><img height=48 src="https://raw.githubusercontent.com/caiogondim/javascript-server-side-logos/master/node.js/standard/454x128.png"></a> |
| --- |
| 0.10+ ✔ |


## Credits
- Moleskine icon by [Monika Ciapala](http://thenounproject.com/merdesign/)
- Markdown icon by [Dustin Curtis](https://github.com/dcurtis/markdown-mark)


## Contributors

```
143  Caio Gondim
  4  David Godfrey
  2  Sven Anders Robbestad
  1  Dan Lukinykh
  1  Bent Cardan
  1  Gleb Bahmutov
  1  netmml
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
