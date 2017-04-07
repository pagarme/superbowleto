const webpack = require('webpack')
const { join } = require('path')
const { externals } = require('./webpackfile.base.js')

module.exports = {
  entry: './webpack/dev.import.jsx',
  output: {
    path: join(__dirname, '../build'),
    filename: '[name].js'
  },
  target: 'node',
  externals: externals({ production: false }),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __TEST__: true
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    }),
  ]
}
