const package = require('./package.json')
const { writeFileSync } = require('fs')

const externals = (options = {}) => {
  const dependencies = options.production
    ? package.dependencies
    : Object.assign({}, package.dependencies, package.devDependencies)

  return Object
    .keys(dependencies)
    .reduce((modules, module) =>
      Object.assign({}, modules, { [module]: `commonjs ${module}` }),
      {}
    )
}

exports.externals = externals

const requireAll = () => {
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

exports.requireAll = requireAll
