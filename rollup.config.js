export default {
  input: 'src/index.js',
  acorn: {
    plugins: {
      classFields: true
    }
  },
  acornInjectPlugins: [
    require('acorn-class-fields')
  ],
  output: [
    {
      file: 'dist/analyzer.esm.js',
      format: 'es'
    },
    {
      file: 'dist/analyzer.js',
      name: 'analyzer',
      exports: 'named',
      format: 'umd'
    }
  ]
}
