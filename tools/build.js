import webpack from 'webpack'
import fs from 'fs-extra'
import paths from './config/paths'
import config from './config/webpack.config'

function bundle() {
  webpack(config).run((err, stats) => {
    if (err) {
      console.log(err)
      return
    }
    console.info(stats.toString(config.stats))
  })
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  })
}

function build() {
  // clean build folder
  fs.emptydirSync(paths.appBuild)
  // copy public path
  copyPublicFolder()
  // create bundle
  bundle()
}

build()
