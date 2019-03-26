# Expression Analyzer

## Usage

```js
import analyze from 'analyzer'

const input = 'hello("world!")'

analyze(input, state => {
  console.log('Expression or string char:', state.current)
})

// Or

analyze(input, {
  expression (state) {
    console.log('Expression char:', state.current)
  },
  string (state) {
    console.log('String char:', state.current)
  }
})
```

## API Documentation

### analyze(input, handlers)

  Analyze given `string` or [`State`](#state-object) object.

  **Arguments:**

  - **input:** An `string` or [`State`](#state-object) object representing the input to be analyzed.
  - **handlers:** A `function` intercepting the given `input`.

  **Returns:**

  [`State`](#state-object) object analyzed.

### analyze.expression(input, handler)

```js
analyze.expression(input, state => {
  console.log(state.current)
})

/**
 * Instead of:
 *
 * analyze(input, { expression (state) {...} })
 */
```

### analyze.string(input, handler)

```js
analyze.string(input, state => {
  console.log(state.current)
})

/**
 * Instead of:
 *
 * analyze(input, { string (state) {...} })
 */
```

### analyze.STOP

  Signal which stops current analyzing process

```js
const resultState = analyze('abc', state => {
  if (state.is('b')) {
    return analyze.STOP
  }
})

console.log(resultState.current) // b
```

### `State` object

*TODO*
