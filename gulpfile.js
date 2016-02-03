var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var http = require('http');
var PuxMiddleware = require('pux-middleware');
var express = require('express');
var del = require('del');
var config = require('./webpack.config');
var replace = require('gulp-replace');

var devServerMiddleware;

gulp.task('clean', function (done) {
  return del(['dist', 'output'], done);
});

gulp.task('copy-assets', ['clean'], function () {
  gulp.src(['src/html/index.html'])
    .pipe(replace('{{markup}}', ''))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['copy-assets'], function (done) {
  webpack(config, outputWebpackStats(done));
});

gulp.task('refresh-bundle', function (done) {
  devServerMiddleware.run(outputWebpackStats(done));
});

gulp.task('serve', ['build'], function (done) {
  makeServer().listen(3000, function () {
    gutil.log('Server listening on localhost:3000');
    done();
  });
});

gulp.task('watch', ['clean'], function (done) {
  gutil.log('[webpack]', 'Building...');
  var server = makeServer();
  devServerMiddleware.run(outputWebpackStats(function () {
    server.listen(3000, function () {
      gutil.log('Server listening on localhost:3000');
      done();
    });
  }));
  gulp.watch('src/purs/**/*.purs', ['refresh-bundle']);
});

gulp.task('default', ['watch']);

function outputWebpackStats(done) {
  return function (err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', 'Build finished.\n' + stats.toString({
      colors: true,
      chunks: false
    }));
    done();
  };
};

function makeServer() {
  var app = express();
  var server = http.createServer(app);
  devServerMiddleware = PuxMiddleware(config, server, {
    html: 'src/html/index.html'
  });
  app.use(devServerMiddleware);
  return server;
};
