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
