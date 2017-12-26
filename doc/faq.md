# FAQ

## Disabling one method on an instance at runtime

```js
// To disable a given method, just pass a no-op to it
logger.warn = function() {}

// To reenable, attach it again to the prototype
logger.warn = logdown.prototype.warn
```

## Align prefixes

If you want to align the output of each instance, like the example below:

```
[ipsum]   lorem
[sitamet] lorem
[dolor]   lorem
```

Use the the following function

```js
function alignPrefixes(Logdown) {
  var longest = logdown._instances.sort(function(a, b) {
    return b.opts.prefix.length - a.opts.prefix.length
  })[0]

  logdown._instances.forEach(function(instance) {
    var padding = new Array(
      Math.max(longest.opts.prefix.length - instance.opts.prefix.length + 1, 0),
    ).join(' ')
    instance.opts.prefix = instance.opts.prefix + padding
  })
}
```

## Enable/disable instance at runtime

Set the instance state `isEnabled` to false to prevent it to log.

```js
logger.state.isEnabled = false
```

If you don't have direct access to the instance, use `logdown.getInstanceByPrefix` to get an instance reference.

```js
const logger = logdown.getInstanceByPrefix('foo')
logger.state.isEnabled = false
```
