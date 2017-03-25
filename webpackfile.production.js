const join = require('path').join
const dependencies = require('./package.json').dependencies

const externals = Object.keys(dependencies)
  .reduce((modules, module) =>
    Object.assign({}, modules, { [module]: `commonjs ${module}` }),
    {}
  )

module.exports = {
  context: join(__dirname, 'src'),
  entry: {
    boleto: './resources/boleto/handler.js',
    queue: './resources/queue/handler.js',
  },
  output: {
    path: join(__dirname, 'build'),
    filename: '[name].js'
  },
  target: 'node',
  externals,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
