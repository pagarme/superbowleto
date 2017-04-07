/**
 * This file is used as an entrypoint for `webpackfile.test.js`. It basically
 * uses webpack's require.context to recursively requires all files within the
 * defined folders.
 *
 * NOTE: Due to the way webpack loaders and require works, this file needs to
 * have a different extension from the extensions it requires. That's why this
 * file's extension is `jsx`: to not conflict with the required extensions.
 */

const requireContext = (context) => context.keys().forEach(context)

const contexts = [
  require.context('../test', true, /\.(ts|js|json)$/),
  require.context('../src', true, /\.(ts|js|json)$/)
]

contexts.forEach(requireContext)

