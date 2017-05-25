const webpack = require('webpack')
const { join } = require('path')
const { externals } = require('./webpackfile.base.js')

module.exports = {
  context: join(__dirname, '../src'),
  entry: {
    boleto: './resources/boleto/index.js'
  },
  output: {
    path: join(__dirname, '../dist'),
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  },
  target: 'node',
  externals: externals({ production: true }),
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
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
