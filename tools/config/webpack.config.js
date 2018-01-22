import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import argv from './argv'
import babelrcConfig from './babelrc.config'
import getClientEnvironment from './env'
import paths from './paths'

const publicPath = argv.isDebug ? '/' : paths.servedPath
const publicUrl = argv.isDebug ? '' : publicPath.slice(0, -1)
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl)

const commonStaticAssetName = argv.isDebug
  ? '[path][name].[ext]?[hash:8]'
  : '[hash:8].[ext]'

const webpack_config = {
  entry: [
    'babel-polyfill',
    ...(argv.isDebug ? ['react-hot-loader/patch'] : []),
    paths.appIndexJs,
  ],
  output: {
    filename: argv.isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: argv.isDebug
      ? '[name].chunk.js'
      : '[name].[chunkhash:8].chunk.js',
    path: paths.appBuild,
    // https://webpack.js.org/configuration/output/#output-pathinfo
    // Tell webpack to include comments in bundles with information about the contained modules.
    pathinfo: argv.isDebug,
    publicPath,
  },

  // generate source map
  devtool: argv.isMap
    ? argv.isDebug ? 'cheap-module-source-map' : 'source-map'
    : false,

  // Don't attempt to continue if there are any errors.
  bail: !argv.isDebug,

  cache: argv.isDebug,

  resolve: {
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
  },

  // Specify what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: true,
    timings: true,
    version: argv.isDebug,
  },

  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      // Loaders
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              ...babelrcConfig,
            },
          },
        ],
      },

      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { importLoaders: 1 } },
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: path.resolve(
                      `${paths.tools}/config/postcss.config.js`,
                    ),
                  },
                },
              },
            ],
          }),
        ),
      },

      // Rules for images
      {
        test: /\.(bmp|gif|jpg|jpeg|png|svg)$/,
        oneOf: [
          // Inline lightweight images into CSS
          {
            issuer: /\.css$/,
            oneOf: [
              // Inline lightweight SVGs as UTF-8 encoded DataUrl string
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                  name: commonStaticAssetName,
                  limit: 4096, // 4kb
                },
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              {
                loader: 'url-loader',
                options: {
                  name: commonStaticAssetName,
                  limit: 4096, // 4kb
                },
              },
            ],
          },

          // Or return public URL to image resource
          {
            loader: 'file-loader',
            options: {
              name: commonStaticAssetName,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin({
      disable: argv.isDebug,
      filename: '[name].[contenthash:8].css',
      allChunks: true,
    }),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // https://webpack.js.org/plugins/commons-chunk-plugin/
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource),
    }),

    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin(env.raw),
    // Define free variables
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin(env.stringified),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: argv.isDebug
        ? {}
        : {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
    }),

    ...(argv.isDebug ? [new webpack.HotModuleReplacementPlugin()] : []),

    // Decrease script evaluation time
    // https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
    ...(argv.isDebug ? [] : [new webpack.optimize.ModuleConcatenationPlugin()]),

    // Minimize all JavaScript output of chunks
    // https://github.com/mishoo/UglifyJS2#compressor-options
    ...(argv.isDebug
      ? []
      : [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              unused: true,
              dead_code: true,
              screw_ie8: true,
            },
            mangle: {
              screw_ie8: true,
            },
            output: {
              comments: false,
              screw_ie8: true,
            },
            sourceMap: argv.isMap,
          }),
        ]),

    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    ...(argv.isDebug
      ? []
      : [new ManifestPlugin({ fileName: 'asset-manifest.json' })]),

    // Webpack Bundle Analyzer
    // https://github.com/th0r/webpack-bundle-analyzer
    ...(argv.isAnalyse ? [new BundleAnalyzerPlugin()] : []),

    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.

    ...(argv.isDebug
      ? []
      : [
          new SWPrecacheWebpackPlugin({
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            logger(message) {
              if (message.indexOf('Total precache size is') === 0) {
                // This message occurs for every build and is a bit too noisy.
                return
              }
              if (message.indexOf('Skipping static resource') === 0) {
                // This message obscures real errors so we ignore it.
                // https://github.com/facebookincubator/create-react-app/issues/2612
                return
              }
              console.info(message)
            },
            minify: true,
            // For unknown URLs, fallback to the index page
            navigateFallback: `${publicUrl}/index.html`,
            // Ignores URLs starting from /__ (useful for Firebase):
            // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            // Don't precache sourcemaps (they're large) and build asset manifest:
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
          }),
        ]),
  ],
}

export default webpack_config
