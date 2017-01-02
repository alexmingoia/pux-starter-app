const path = require('path')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'

const entries = [path.join(__dirname, 'support/client.entry.js')]

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
]

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  )
} else {
  entries.unshift('webpack-hot-middleware/client?reload=true');
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}

const config = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'static', 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.purs$/,
        loader: 'purs-loader',
        exclude: /node_modules/,
        query: isProd ? {
          bundle: true,
          bundleOutput: 'static/dist/bundle.js'
        } : {
          psc: 'psa'
        }
      }
    ],
  },
  plugins: plugins,
  resolveLoader: {
    modules: [
      path.join(__dirname, 'node_modules')
    ]
  },
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    },
    modules: [
      'node_modules',
      'bower_components'
    ],
    extensions: ['.js', '.purs']
  },
  performance: { hints: false },
  stats: {
    hash: false,
    timings: false,
    version: false,
    assets: false,
    errors: true,
    colors: false,
    chunks: false,
    children: false,
    cached: false,
    modules: false,
    chunkModules: false
  }
}

// If this file is directly run with node, start the development server
// instead of exporting the webpack config.
if (require.main === module) {
  const compiler = webpack(config)
  const serverCompiler = webpack(require('./webpack.config.server.js'))

  console.log('Compiling...')

  serverCompiler.run((err) => {
    if (err) return console.error(err)

    const server = require('./dist/server.js')

    server([
      require('connect-history-api-fallback')(),
      require("webpack-dev-middleware")(compiler, {
        publicPath: config.output.publicPath,
        stats: {
          assets: false,
          cached: false,
          cachedAssets: false,
          children: false,
          chunks: false,
          chunkModules: false,
          chunkOrigins: false,
          hash: false,
          performance: false,
          timing: false,
          version: false
        }
      }),
      require("webpack-hot-middleware")(compiler)
    ])()
  })
} else {
  module.exports = config
}
