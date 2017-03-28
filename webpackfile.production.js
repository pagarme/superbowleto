const webpack = require('webpack')
const { join } = require('path')
const { dependencies } = require('./package.json')

const externals = () => Object.keys(dependencies)
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
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  },
  target: 'node',
  externals: externals(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __TEST__: false
    })
  ]
}
