import paths from './paths'
import argv from './argv'

const pkg = require(paths.appPackageJson)

const babelrcConfig = {
  babelrc: false,
  compact: !argv.isDebug,
  cacheDirectory: argv.isDebug,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: pkg.browserslist,
        },
        // https://github.com/gaearon/react-hot-loader
        modules: argv.isDebug ? false : 'commonjs',
      },
    ],
    '@babel/preset-stage-2',
    [
      '@babel/preset-react',
      {
        development: argv.isDebug,
      },
    ],
  ],
  plugins: [
    'transform-export-extensions',
    ...(argv.isDebug ? ['react-hot-loader/babel'] : []),
    // Treat React JSX elements as value types and hoist them to the highest scope
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-important-elements
    ...(argv.isDebug
      ? []
      : ['@babel/plugin-transform-react-constant-elements']),
    // Replaces the React.createElement function with one that is more optimized for production
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
    ...(argv.isDebug ? [] : ['@babel/plugin-transform-react-inline-elements']),
    // Remove unnecessary React propTypes from the production build
    // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
    ...(argv.isDebug ? [] : ['transform-react-remove-prop-types']),
  ],
  ignore: [paths.appNodeModules, paths.appBuild],
}

export default babelrcConfig
