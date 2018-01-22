const paths = require('./tools/config/paths')

// Babel configuration
// https://babeljs.io/docs/usage/api/
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-stage-2',
    '@babel/preset-react',
  ],
  plugins: ['transform-export-extensions'],
  ignore: [paths.appNodeModules, paths.appBuild],
}
