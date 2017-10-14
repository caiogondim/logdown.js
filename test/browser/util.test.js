/* eslint-env jest */

const isColorSupported = require('../../src/util/is-color-supported/browser')
const getGlobal = require('../../src/util/get-global').getGlobal

describe('isColorSupported()', () => {
  const origNavigator = window.navigator

  beforeEach(() => {
    delete window.navigator
    document.documentElement.style.WebkitAppearance = true
  })

  afterEach(() => {
    window.navigator = origNavigator
    delete document.documentElement.style.WebkitAppearance
  })

  it('returns false if no userAgent', () => {
    expect(isColorSupported()).toBe(false)
  })

  it('returns true for firefox', () => {
    window.navigator = {
      userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
    }

    expect(isColorSupported()).toBe(true)
  })

  it('returns true for chrome', () => {
    window.navigator = {
      userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
    }

    expect(isColorSupported()).toBe(true)
  })

  it('returns true for safari', () => {
    window.navigator = {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A'
    }

    expect(isColorSupported()).toBe(true)
  })

  it('returns false for Edge', () => {
    window.navigator = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
    }

    expect(isColorSupported()).toBe(false)
  })
})

describe('getGlobal()', () => {
  it('returns this if no global or self', () => {
    const that = {}

    expect(getGlobal.call(that)).toBe(that)
  })

  it('returns self if it is set', () => {
    const slf = {}
    const glb = {}
    slf.self = slf
    glb.global = glb

    expect(getGlobal(slf, glb)).toBe(slf)
  })

  it('returns global if it is set', () => {
    const slf = undefined
    const glb = {}
    glb.global = glb

    expect(getGlobal(slf, glb)).toBe(glb)
  })
})
