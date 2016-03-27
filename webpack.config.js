var path = require('path');
var webpack = require('webpack');
var PurescriptWebpackPlugin = require('purescript-webpack-plugin');
var isProduction = process.env.NODE_ENV === 'production';

var plugins = [
  new PurescriptWebpackPlugin({
    src: ['bower_components/purescript-*/src/**/*.purs', 'src/**/*.purs'],
    ffi: ['bower_components/purescript-*/src/**/*.js']
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoErrorsPlugin());
}

module.exports = {
  entry: ['./src/js/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/bundle.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.purs$/,
        loader: 'purs',
        exclude: /node_modules/
      }
    ],
  },
  plugins: plugins,
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
      'bower_components'
    ],
    extensions: ['', '.js', '.purs']
  }
};
