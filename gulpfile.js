'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    plugins = require('gulp-load-plugins')(),
    getFolders = function(dir){
      return  fs.readdirSync(dir)
        .filter(function(file) {
          return fs.statSync(path.join(dir, file)).isDirectory();
        });
    };

var
  scripts = [
    './src/**/*.js'
  ],
  demos = [
    './demos/anchor-transitions/assets/js',
    './demos/barebones/assets/js',
    './demos/csstricks/assets/js',
    './demos/sidebar/assets/js'
  ],
  tests = [
    './tests/**/*.js'
  ],
  srcScripts = scripts.concat(tests),
  demoScripts = [ './jquery.smoothState.min.js' ];

/** Serve demos for testing */
gulp.task('serve', [ 'copyDemoFiles' ], function() {
  gulp.src('demos')
    .pipe(plugins.webserver({
      open: true
    }));
});

/** Run all unit tests */
gulp.task('test', function() {
  return gulp.src('./tests/index.html')
        .pipe(plugins.qunit());
});

/** Run all unit tests */
gulp.task('copyDemoFiles', function() {
  return gulp.src(demoScripts)
        .pipe(gulp.dest(demos[0]))
        .pipe(gulp.dest(demos[1]))
        .pipe(gulp.dest(demos[2]))
        .pipe(gulp.dest(demos[3]));
});

/** Lint JavaScript */
gulp.task('jshint', function () {
  return gulp.src(srcScripts)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

/** Concatenate and minify JavaScript */
gulp.task('uglify', function () {
  return gulp.src(scripts)
    .pipe(plugins.concat('jquery.smoothState.min.js'))
    .pipe(plugins.uglify({ preserveComments: 'some' }))
    .pipe(gulp.dest('./'))
    .pipe(plugins.size({ title: 'scripts' }));
});

/** Watch changes */
gulp.task('watch', function() {
  gulp.watch(srcScripts, [ 'jshint', 'test', 'uglify', 'copyDemoFiles' ]);
});

/** Default task */
gulp.task('default', [ 'jshint', 'test' ], function() {
  gulp.start('uglify');
});
