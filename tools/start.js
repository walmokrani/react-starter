import path from 'path'
import WebpackDevServer from 'webpack-dev-server'
import openBrowser from 'react-dev-utils/openBrowser'
import { prepareUrls } from 'react-dev-utils/WebpackDevServerUtils'
import webpack from 'webpack'
import chalk from 'chalk'
import fs from 'fs-extra'
import config from './config/webpack.config'
import paths from './config/paths'

// remove build folder
fs.removeSync(paths.appBuild)

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const urls = prepareUrls(protocol, HOST, DEFAULT_PORT)

const options = {
  hot: true,
  publicPath: config.output.publicPath,
  stats: config.stats,
  // Enable gzip compression of generated files.
  compress: true,
  // Silence WebpackDevServer's own logs since they're generally not useful.
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'none',
  // show warnings as well as errors in the console
  overlay: {
    warnings: true,
    errors: true,
  },
  host: HOST,
  port: DEFAULT_PORT,
  contentBase: paths.appBuild,
  watchContentBase: true,
  // Reportedly, this avoids CPU overload on some systems.
  // https://github.com/facebookincubator/create-react-app/issues/293
  // src/node_modules is not ignored to support absolute imports
  // https://github.com/facebookincubator/create-react-app/issues/1065
  watchOptions: {
    ignored: new RegExp(
      `^(?!${path
        .normalize(`${paths.appSrc}/`)
        .replace(/[\\]+/g, '\\\\')}).+[\\\\/]node_modules[\\\\/]`,
      'g',
    ),
  },
  // Enable HTTPS if the HTTPS environment variable is set to 'true'
  https: protocol === 'https',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':
      'X-Requested-With, content-type, Authorization',
  },
}

WebpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new WebpackDevServer(compiler, options)

server.listen(DEFAULT_PORT, HOST, err => {
  if (err) {
    console.log(chalk.red(err))
    return
  }
  console.log(chalk.cyan(' ==> Starting the development server...\n'))
  openBrowser(urls.localUrlForBrowser)
})
