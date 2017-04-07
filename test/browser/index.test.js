/* eslint-env jest */

jest.mock('../../src/util/is-webkit', () => () => true)
jest.mock('../../src/util/is-browser', () => () => true)
jest.mock('../../src/util/is-color-supported', () => () => true)

describe('browser', () => {
  require('./local-storage-debug-var')
  require('./logging-methods')
})
