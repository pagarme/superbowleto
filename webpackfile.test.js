const { join } = require('path')
const { mkdirSync, writeFileSync } = require('fs')
const { dependencies } = require('./package.json')

const entry = () => {
  const content = `
    var sourceFiles = require.context('./src', true, /\.(js|json)$/);
    sourceFiles.keys().forEach(sourceFiles);

    var testFiles = require.context('./test', true, /\.(js|json)$/);
    testFiles.keys().forEach(test);
  `

  const importFile = './.webpack.test.import'
  writeFileSync(importFile, content)

  return importFile
}

const externals = () => Object.keys(dependencies)
  .reduce((modules, module) =>
    Object.assign({}, modules, { [module]: `commonjs ${module}` }),
    {}
  )

module.exports = {
  entry: entry(),
  output: {
    path: join(__dirname, '__tests__'),
    filename: '[name].js'
  },
  target: 'node',
  externals: externals(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].js'
            }
          },
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].json'
            }
          }
        ]
      }
    ]
  }
}
