/* eslint-env jest */

jest.mock('../../src/util/is-browser', () => () => false)

describe('node', () => {
  require('./logging-methods')
  require('./debug-env-var')
})
