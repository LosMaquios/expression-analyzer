import tokens from './tokens.js'
import State, { modes as stateModes } from './State.js'

export { State, stateModes, tokens }
export default analyze

const privateState = new WeakMap()

/**
 * Especial tokens to ignore
 *
 * @type {Array<string>}
 */
const IGNORED_TOKENS = [
  tokens.LINE_FEED,
  tokens.CAR_RETURN,
  tokens.WHITESPACE,
  tokens.TAB
]

const defaultHandlers = {

  /**
   * Intercept expression chars
   *
   * @param {State}
   *
   * @return {analyze.STOP=}
   */
  expression (state) {},

  /**
   * Intercept string chars
   *
   * @param {State}
   *
   * @return {analyze.STOP=}
   */
  string (state) {}
}

/**
 * Intercept expression chars to rewrite/process a given input
 *
 * @param {string|State} inputOrState
 * @param {Object|Function} handlerOrHandlers
 *
 * @return {State}
 */
function analyze (inputOrState, handlerOrHandlers) {
  const handlers = {}

  if (typeof handlerOrHandlers === 'function') {
    handlers.expression = handlers.string = handlerOrHandlers
  } else {
    Object.assign(handlers, defaultHandlers, handlerOrHandlers)
  }

  const state = typeof inputOrState === 'string' ? new State(inputOrState) : inputOrState
  const _state = getPrivateState(state)

  while (!state.end) {
    switch (state.current) {
      case tokens.DOLLAR_SIGN:
        if (state.is(tokens.OPEN_BRACE, 1) && state.inTemplate && !state.escaping) {
          state.mode = stateModes.EXPRESSION_MODE
          _state.templateStack.push(_state.braceDepth++)

          // Skip `${`
          state.advance(2)
        }
        break

      case tokens.OPEN_BRACE:
        state.inExpression && _state.braceDepth++
        break

      case tokens.CLOSE_BRACE:
        if (state.inExpression && --_state.braceDepth === _state.templateStack[_state.templateStack.length - 1]) {
          state.mode = stateModes.TEMPLATE_MODE
          _state.templateStack.pop()

          // Skip `}`
          state.advance()
        }
        break

      case tokens.BACKTICK: case tokens.SINGLE_QUOTE: case tokens.DOUBLE_QUOTE:
        if (state.inExpression) {
          state.mode = state.is(tokens.BACKTICK) ? stateModes.TEMPLATE_MODE : stateModes.STRING_MODE
          _state.stringOpen = state.current

          // Skip opening string quote
          state.advance()
        } else if (state.is(_state.stringOpen) && !state.escaping) {
          state.mode = stateModes.EXPRESSION_MODE
          _state.stringOpen = null

          // Skip current closing string quote
          state.advance()
        }
        break
    }

    // Avoid call handlers if finished
    if (state.end) break

    let result

    if (state.inExpression) {

      // Ignore some special chars on expression
      if (IGNORED_TOKENS.some(token => state.is(token))) {
        state.advance()
        continue
      }

      result = handlers.expression(state)

    // Skip escape char
    } else if (!state.is(tokens.BACKSLASH) || state.escaping) {
      result = handlers.string(state)
    }

    // Current analyzing can be stopped from handlers
    if (result === analyze.STOP) break

    // Detect correct escaping
    state.escaping = state.mode !== stateModes.EXPRESSION_MODE && state.is(tokens.BACKSLASH) && !state.escaping

    state.advance()
  }

  return state
}

/**
 * Signal to stop analyze
 *
 * @type {number}
 */
analyze.STOP = 5709 // S(5) T(7) O(0) P(9)

/**
 * Analyze string chars from a given `inputOrState`
 *
 * @param {string|State} inputOrState
 * @param {Function} handler
 *
 * @return {State}
 */
analyze.expression = function analyzeExpression (inputOrState, handler) {
  return analyze(inputOrState, { expression: handler })
}

/**
 * Analyze expression chars from a given `inputOrState`
 *
 * @param {string|State} inputOrState
 * @param {Function} handler
 *
 * @return {State}
 */
analyze.string = function analyzeString (inputOrState, handler) {
  return analyze(inputOrState, { string: handler })
}

/**
 * Get private state from a given `state`
 *
 * @param {State} state
 *
 * @return {Object}
 * @private
 */
function getPrivateState (state) {
  let _state = privateState.get(state)

  if (!_state) {
    privateState.set(state, _state = {

      /**
       * @type {number}
       */
      braceDepth: 0,

      /**
       * @type {Array<number>}
       */
      templateStack: [],

      /**
       * @type {string}
       */
      stringOpen: null
    })
  }

  return _state
}
