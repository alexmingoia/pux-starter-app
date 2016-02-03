var path = require('path');
var webpack = require('webpack');
var PurescriptWebpackPlugin = require('purescript-webpack-plugin');

var plugins = [
  new PurescriptWebpackPlugin({
    src: ['bower_components/purescript-*/src/**/*.purs', 'src/**/*.purs'],
    ffi: ['bower_components/purescript-*/src/**/*.js', 'src/**/*FFI.js']
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}

loaders = [
  {
    test: /\.purs$/,
    loader: 'purs',
    exclude: /node_modules/
  },
  {
    test: /\.js$/,
    loader: 'babel',
    query: {
      presets: ['react', 'es2015']
    },
    exclude: /node_modules/
  }
];

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/bundle.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: loaders.concat([
      {
        test: require.resolve('react'),
        loader: 'expose?React'
      }
    ]),
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
