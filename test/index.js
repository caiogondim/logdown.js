var chai = require('chai')
var assert = require('assert')
var sinon = require('sinon')
var Logdown = require('../src/index')

function createInstances() {
  return [
    new Logdown({prefix: 'foo'}),
    new Logdown({prefix: 'bar'}),
    new Logdown({prefix: 'quz'}),
    new Logdown({prefix: 'baz'})
  ]
}

describe('::enable', function() {
  var sandbox

  beforeEach(function() {
    sandbox = sinon.sandbox.create()

    sandbox.stub(global.console, 'log')
  })

  afterEach(function(){
    sandbox.restore()
  })

  it('`Logdown.enable(*)` should enable all instances', function() {
    Logdown.disable('*')
    Logdown.enable('*')
    var instances = createInstances()
    instances.forEach(function(instance) {
      instance.log('Lorem')
    })

    sinon.assert.called(console.log)
  })
})
