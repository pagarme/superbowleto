import { join } from 'path'
import { dependencies } from './package.json'

const externals = Object.keys(dependencies)
  .reduce((modules, module) =>
    Object.assign({}, modules, { [module]: `commonjs ${module}` }),
    {}
  )

export default {
  context: join(__dirname, 'src'),
  entry: {
    web: './web.js',
    worker: './worker.js'
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

