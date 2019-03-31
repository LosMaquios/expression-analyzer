import test from 'ava'

import analyze from '../src/index'

const code = 'fn("string" `tem${pl}ate`)'

test('should analyze correctly', t => {
  const result = {
    expression: '',
    string: '',
    template: ''
  }

  analyze(code, {
    expression (state) {
      result.expression += state.current
    },
    string (state) {
      result[state.inString ? 'string' : 'template'] += state.current
    }
  })

  t.is(result.expression, 'fn(pl)')
  t.is(result.string, 'string')
  t.is(result.template, 'temate')
})
