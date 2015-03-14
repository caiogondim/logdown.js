# Logdown <img src="https://travis-ci.org/caiogondim/logdown.svg?branch=master" alt="Travis CI"> <img src="https://david-dm.org/caiogondim/logdown/dev-status.svg" alt="David DM">

<img src="http://raw.github.com/caiogondim/logdown/master/icon/icon.svg" width="256">

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


## Using

In node.js or io.js

```js
var Logdown = require('logdown')
var debug = new Logdown({prefix: 'foo'})
debug.log('lorem')
debug.warn('ipsum')
debug.info('dolor')
debug.error('sit amet')
```

In the browser

```js
var debug = new Logdown({prefix: 'foo'})
debug.log('lorem')
debug.warn('ipsum')
debug.info('dolor')
debug.error('sit amet')
```


## API

### `new Logdown(opts)`

When creating a new `Logdown` object, you can pass the following values.

#### `opts.prefix`

Type: 'String'
Default: `''`

```js
var debug = new Logdown({prefix: 'foo'})
debug.log('Lorem ipsum') // Will use console.log with a prefix
```

You should use the name of your module.
You can, also, use `:` to separate modules inside one big module.

```js
var bar = new Logdown({prefix: 'foo:bar'})
bar.log('Lorem ipsum')

var quz = new Logdown({prefix: 'foo:quz'})
quz.log('Lorem Ipsum')
```

This way it is clear each module are logging information, and it is also easier
to disable/enable some of them.

#### `opts.markdown`

Type: 'Boolean'
Default: `true`

If setted to `false`, the markdown will not be parsed and stylized accordingly.

```js
var bar = new Logdown({markdown: false})
bar.log('Lorem *ipsum*') // Will not parse the markdown
```

### `instance.log()`

In the server and the browser will use the `console.log()` native method, plus
prefix and stylized markdown.

```js
var bar = new Logdown()
bar.log('Lorem *ipsum*')
```

### `instance.info()`

In the browser will use the `console.info()` native method, plus prefix and
stylized markdown. In the server will use `console.log()`, plus a blue `ℹ` (to
better mimic the browser behavior), prefix and stylized markdown.

```js
var bar = new Logdown()
bar.info('Lorem *ipsum*')
```

### `instance.warn()`

In the browser will use the `console.warn()` native method, plus prefix and
stylized markdown. In the server will use `console.log()`, plus a yellow `⚠` (to
better mimic the browser behavior), prefix and stylized markdown.

```js
var bar = new Logdown()
bar.warn('Lorem *ipsum*')
```

### `instance.error()`

In the browser will use the `console.error()` native method, plus prefix and
stylized markdown. In the server will use `console.log()`, plus a red `✖` (to
better mimic the browser behavior), prefix and stylized markdown.

```js
var bar = new Logdown()
bar.error('Lorem *ipsum*')
```

### `Logdown.enable()`

Enable some loggers by its prefix.
It is possible to use `*` as wildcard and `-` as negation.

```js
var foo = new Logdown({prefix: 'foo'})
var bar = new Logdown({prefix: 'bar'})

// Will enable all Logdown instances, but the one with *foo* prefix
Logdown.enable('*, -foo')
```

### `Logdown.disable()`

Disable some loggers by its prefix.
It is possible to use `*` as wildcard and `-` as negation.

```js
// Disable all Logdown instances but the one with bar prefix
Logdown.disable('*, -bar')
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
