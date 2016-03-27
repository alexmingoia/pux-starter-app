var gulp = require('gulp');
var fs = require('fs');
var gutil = require('gulp-util');
var webpack = require('webpack');
var http = require('http');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var express = require('express');
var del = require('del');
var config = require('./webpack.config');
var path = require('path');
var replace = require('gulp-replace');

var port = process.env.PUX_PORT || 3000;

gulp.task('clean', function (done) {
  return del(['dist', 'output'], done);
});

gulp.task('copy-assets', ['clean'], function () {
  gulp.src(['src/images'])
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['copy-assets'], function (done) {
  webpack(config, outputWebpackStats(done));
});

gulp.task('serve', ['build'], function (done) {
  var app = express();
  var server = http.createServer(app);
  var html = fs.readFileSync('src/html/index.html', 'utf8');

  webpack(config, outputWebpackStats(function () {
    var markup = require(path.join(config.output.path, config.output.filename))

    app
      .use(express.static('dist'))
      .use(function (req, res, next) {
        res.send(html.replace('{{markup}}', markup(req.url)));
      });

    server.listen(port, function () {
      gutil.log('Server listening on localhost:' + port);
      done();
    });
  }));
});

gulp.task('watch', ['clean'], function (done) {
  gutil.log('[webpack]', 'Building...');

  config.entry.unshift('webpack-hot-middleware/client');

  var app = express();
  var server = http.createServer(app);
  var compiler = webpack(config, function (err, stats) {
    server.listen(3000, function () {
      gutil.log('Server listening on localhost:' + port);
    });
  });
  var html = fs.readFileSync('src/html/index.html', 'utf8');

  app
    .use(express.static('dist'))
    .use(webpackDevMiddleware(compiler, {
      noInfo: true,
      quiet: true
    }))
    .use(webpackHotMiddleware(compiler, {
      noInfo: true,
      quiet: true,
      stats: { colors: true, chunks: false }
    }))
    .use(function (req, res, next) {
      res.send(html.replace('{{markup}}', ''));
    });
});

gulp.task('default', ['watch']);

function outputWebpackStats(done) {
  return function (err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', 'Build finished.\n' + stats.toString({
      colors: true,
      chunks: false
    }));
    done && done();
  };
};
