import test from 'ava'

import State, { modes } from '../src/State'

const input = '...some invalid code...'

let state

test.beforeEach(_ => {
  state = new State(input)
})

test.serial('should be initialized correctly', t => {
  t.is(state.cursor, 0)
  t.is(state.mode, modes.EXPRESSION_MODE)
  t.is(state.escaping, false)
  t.is(state.input, input)
})

test.serial('should advance cursor', t => {
  t.is(state.advance().cursor, 1)
  t.is(state.advance(2).cursor, 3)
})

test.serial('should back cursor', t => {
  t.is(state.back().cursor, -1)
  t.is(state.back(3).cursor, -4)
})

test.serial('should get char at given index', t => {
  t.is(state.get(0), '.')
  t.is(state.get(5), 'm')
})

test.serial('should check char correctly', t => {
  t.true(state.is('.'))
  t.true(state.is('s', 3))
  t.false(state.is('s', 4))
})

test.serial('should check mode correctly', t => {
  t.true(state.inExpression)

  state.mode = modes.STRING_MODE
  t.true(state.inString)

  state.mode = modes.TEMPLATE_MODE
  t.true(state.inTemplate)
})

test.serial('should check end correctly', t => {
  t.false(state.end)
  t.true(state.advance(state.input.length).end)
})
