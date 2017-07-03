const Webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const package = require('./package.json')
const { join } = require('path')

const externals = () => {
  const dependencies = package.dependencies

  return Object
    .keys(dependencies)
    .reduce((modules, module) =>
      Object.assign({}, modules, { [module]: `commonjs ${module}` }),
      {}
    )
}

module.exports = {
  context: join(__dirname, './build'),
  entry: {
    boleto: './resources/boleto/index.js',
    database: './functions/database/index.js'
  },
  output: {
    path: join(__dirname, './dist'),
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  target: 'node',
  externals: externals(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.ENV': JSON.stringify('production'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new Webpack.BannerPlugin({
      banner: `
        require("source-map-support").install();
        require("core-js");
      `,
      raw: true,
      entryOnly: false
    }),
    new CopyWebpackPlugin([{
      from: './database/migrations',
      to: './migrations',
      context: join(__dirname, './build')
    }])
  ]
}
