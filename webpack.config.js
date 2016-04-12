var path = require('path');
var webpack = require('webpack');
var PurescriptWebpackPlugin = require('purescript-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var port = process.env.PORT || 3000;

var config = {
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'support/index.js'),
  ],
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules|bower_components/ },
      { test: /\.purs$/, loader: 'purs-loader', exclude: /node_modules/ }
    ],
  },
  plugins: [
    {
      apply: function (compiler) {
        compiler.plugin("should-emit", function(compilation) {
          if (compilation.errors.length > 1)
            compilation.errors = compilation.errors.filter(function (error) {
              var message = error.message || error
              return !~message.indexOf('PureScript compilation has failed.');
            });
        });
      }
    },
    new PurescriptWebpackPlugin({
      src: ['bower_components/purescript-*/src/**/*.purs', 'src/**/*.purs'],
      ffi: ['bower_components/purescript-*/src/**/*.js',   'src/**/*.js'],
      bundle: false,
      psc: 'psa',
      pscArgs: {
        sourceMaps: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new HtmlWebpackPlugin({
      template: 'html/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      moduleFilenameTemplate: '[absolute-resource-path]',
      fallbackModuleFilenameTemplate: '[absolute-resource-path]'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  resolve: {
    root: './node_modules',
    modulesDirectories: [
      'node_modules',
      'bower_components'
    ],
    extensions: ['', '.js', '.purs']
  },
};

// If this file is directly run with node, start the development server
// instead of exporting the webpack config.
if (require.main === module) {
  var compiler = webpack(config);
  var app = require('express')();

  // Use webpack-dev-middleware and webpack-hot-middleware instead of
  // webpack-dev-server, because webpack-hot-middleware provides more reliable
  // HMR behavior, and an in-browser overlay that displays build errors
  app
    .use(require("webpack-dev-middleware")(compiler, {
      publicPath: config.output.publicPath,
      watchOptions: {
        poll: false,
      },
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
        chunkModules: false,
      },
    }))
    .use(require("webpack-hot-middleware")(compiler))
    .listen(port);
} else {
  module.exports = config;
}
