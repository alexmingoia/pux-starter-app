var gulp = require('gulp');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var WebpackDevServer = require('webpack-dev-server');
var del = require('del');
var config = require('./webpack.config');

var paths = {
  purescript: 'src/purs/**/*.purs',
  purescriptLibs: 'bower_components/*/src/**/*.purs',
  purescriptForeigns: 'bower_components/*/src/**/*.js',
  javascript: 'src/js/**/*.js',
  output: 'output',
  dist: 'dist'
};

gulp.task('clean', function (cb) {
  return del([paths.output, paths.dist], cb);
});

gulp.task('copy-html', function(){
  return gulp.src('src/html/index.html')
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy-assets', ['copy-html']);

gulp.task('build', ['copy-assets'], function () {
  return gulp.src('src/js/index.js')
    .pipe(webpackStream(config))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['copy-assets'], function (done) {
  (new WebpackDevServer(webpack(config), {
    hot: true,
    // It suppress error shown in console, so it has to be set to false.
    quiet: false,
    // It suppress everything except error, so it has to be set to false as well
    // to see success build.
    noInfo: false,
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
    historyApiFallback: {
      index: '/dist/index.html'
    }
  })).listen(3000, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:3000');
    console.log('Building initial webpack bundle...');
  });
});

gulp.task('default', ['watch']);
