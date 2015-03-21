<img src="http://rawgit.com/caiogondim/logdown/master/img/icon.svg">

# Logdown <img src="https://travis-ci.org/caiogondim/logdown.svg?branch=master" alt="Travis CI"> <img src="https://david-dm.org/caiogondim/logdown/dev-status.svg" alt="David DM">

Logdown is a debug utility for the browser and the server with Markdown support.
It does not have any dependencies and is only 2K gzipped.

You can see it in action in the [example page](//caiogondim.github.io/logdown)
or in the preview below.


## Preview

### Browser
<img src="http://rawgit.com/caiogondim/logdown/master/img/browser-preview.gif">

### Server
<img src="http://rawgit.com/caiogondim/logdown/master/img/node-preview.gif">


## Using

The simplest use of the library in both platforms could be done as follows:

```js
// In the browser
var logger = new Logdown({prefix: 'foo'})
```

If on the server, install it through npm:

```bash
npm install --save logdown
```

And then use it.

```js
// In the server-side or client-side with Browserify
var Logdown = require('logdown')
var logger = new Logdown({prefix: 'foo'})
```

It is highly recommended to use a prefix for your instance, this way you get
a nice prefixed message on console and it is possible to silence instances
based on the prefix name, as we will see after.

After creating your object, you can use the regular `log`, `warn`, `info` and
`error` methods as we have on `console`, but now with Markdown support.

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

### Browser

![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 9+ ✔ | Latest ✔ | 8.0+ ✔ |

### Server

<a href="https://nodejs.org"><img height=48 src="https://raw.githubusercontent.com/caiogondim/javascript-server-side-logos/master/node.js/standard/454x128.png"></a> | <a href="https://iojs.org"><img height=48 src="https://raw.githubusercontent.com/caiogondim/javascript-environments-logos/master/iojs/standard/224x256.png" alt="io.js logo"></a> |
--- | --- |
0.10+ ✔ | 1.0+ ✔ |


## Credits
- Moleskine icon by [Monika Ciapala](http://thenounproject.com/merdesign/)
- Markdown icon by [Dustin Curtis](https://github.com/dcurtis/markdown-mark)


## Contributors

```
101 Caio Gondim     97.1%
1   Bent Cardan     1.0%
1   Dan Lukinykh    1.0%
1   Gleb Bahmutov   1.0%
```


## License
The MIT License (MIT)

Copyright (c) 2015 [Caio Gondim](http://caiogondim.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
