/* eslint-env jest */

const Markdown = require('../../src/markdown/Markdown')
const markdown = new Markdown({
  renderer: {
    '_': (input) => `<i>${input}</i>`,
    '*': (input) => `<b>${input}</b>`,
    '`': (input) => `<code>${input}</code>`
  }
})

it('should parse bold', () => {
  expect(markdown.parse('*one*')).toBe('<b>one</b>')
})

it('should parse italic', () => {
  expect(markdown.parse('_two_')).toBe('<i>two</i>')
})

it('should parse code', () => {
  expect(markdown.parse('`three`')).toBe('<code>three</code>')
})

it('should parse mutiple tokens in string', () => {
  expect(
    markdown.parse('lorem `ipsum` *dolor* _sit_ amet')
  ).toBe('lorem <code>ipsum</code> <b>dolor</b> <i>sit</i> amet')
})

it('allows rules nesting', () => {
  expect(markdown.parse('foo _one*two*three*four*five_ bar')).toBe('foo <i>one<b>two</b>three<b>four</b>five</i> bar')
})

it('ignores improperly nested/closed rules', () => {
  expect(markdown.parse('_before*after_')).toBe('<i>before*after</i>')
  expect(markdown.parse('*foo_`bar*')).toBe('<b>foo_`bar</b>')
  expect(markdown.parse('foo_bar*')).toBe('foo_bar*')
  expect(markdown.parse('*foo_bar')).toBe('*foo_bar')
  expect(markdown.parse('foo_*bar')).toBe('foo_*bar')

  expect(markdown.parse('`hi`lo`')).toBe('<code>hi</code>lo`')
  expect(markdown.parse('`foo')).toContain('`foo')
})

// Some of tests based on http://spec.commonmark.org/0.28/#inlines

xit('should not format snake_case words', () => { // do we really need this?
  expect(markdown.parse('foo_bar_')).toBe('foo_bar_')
  expect(markdown.parse('_foo_bar')).toBe('_foo_bar')

  expect(markdown.parse('_*te_st*')).toBe('_<b>te_st</b>')
  expect(markdown.parse('_*te_st*_')).toBe('<i><b>te_st</b></i>')
})

describe('code spans', () => {
  it('ignores markdown inside code spans', () => {
    expect(
      markdown.parse('`_call_` the `*foo_bar*` method on the `quux_service` endpoint')
    ).toBe('<code>_call_</code> the <code>*foo_bar*</code> method on the <code>quux_service</code> endpoint')
  })

  it('ignores escaping inside of code spans', () => {
    expect(markdown.parse('`foo\\`bar`')).toBe('<code>foo\\</code>bar`')
  })

  it('treats code span backticks with highest priority', () => {
    expect(markdown.parse('baz*foo`*`')).toBe('baz*foo<code>*</code>')
  })

  it('allows escaping', () => {
    expect(markdown.parse('\\not \\*bold*')).toBe('\\not *bold*')
    expect(markdown.parse('\\\\*bold*')).toBe('\\<b>bold</b>')
  })
})
