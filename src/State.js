export const modes = {

  /**
   * @type {number}
   */
  EXPRESSION_MODE: 0,

  /**
   * @type {number}
   */
  TEMPLATE_MODE: 1,

  /**
   * @type {number}
   */
  STRING_MODE: 2
}

export default class State {

  /**
   * Current input index
   *
   * @type {number}
   */
  cursor = 0

  /**
   * Current state mode
   *
   * @type {string}
   */
  mode = modes.EXPRESSION_MODE

  /**
   * Check for escaping chars
   *
   * @type {boolean}
   */
  escaping = false

  constructor (input) {

    /**
     * Input code
     *
     * @type {string}
     */
    this.input = input
  }

  /**
   * True if
   *
   * @type {boolean}
   */
  get end () {
    return this.cursor >= this.input.length
  }

  /**
   * Previous char
   *
   * @type {string}
   */
  get previous () {
    return this.get(this.cursor - 1)
  }

  /**
   * Current char
   *
   * @type {string}
   */
  get current () {
    return this.get(this.cursor)
  }

  /**
   * Next char
   *
   * @type {string}
   */
  get next () {
    return this.get(this.cursor + 1)
  }

  /**
   * True if current state mode is `template`
   *
   * @type {boolean}
   */
  get inTemplate () {
    return this.mode === modes.TEMPLATE_MODE
  }

  /**
   * True if current state mode is `string`
   *
   * @type {boolean}
   */
  get inString () {
    return this.mode === modes.STRING_MODE
  }

  /**
   * True if current state mode is `expression`
   *
   * @type {boolean}
   */
  get inExpression () {
    return this.mode === modes.EXPRESSION_MODE
  }

  /**
   * Check if a given `char` is the current char state
   *
   * @param {string} char
   * @param {number} offset
   *
   * @return {boolean}
   */
  is (char, offset = 0) {
    return this.get(this.cursor + offset) === char
  }

  /**
   * Get a `char` at specific `index`
   *
   * @param {number} index
   *
   * @return {number}
   */
  get (index) {
    return this.input[index]
  }

  /**
   * Back `cursor` by given `steps`
   *
   * @param {number} steps
   *
   * @return {State}
   */
  back (steps = 1) {
    this.cursor -= steps

    return this
  }

  /**
   * Advance `cursor` by given `steps`
   *
   * @param {number} steps
   *
   * @return {State}
   */
  advance (steps = 1) {
    this.cursor += steps

    return this
  }
}
