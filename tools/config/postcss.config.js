const paths = require('./paths')
const argv = require('./argv').default

const pkg = require(paths.appPackageJson)

module.exports = () => ({
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-cssnext': {
      browsers: pkg.browserslist,
    },
    cssnano: argv.isDebug ? false : { autoprefixer: false },
  },
})
