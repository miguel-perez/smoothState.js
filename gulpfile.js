'use strict';

var gulp = require('gulp'),
    qunit = require('node-qunit-phantomjs'),
    plugins = require('gulp-load-plugins')();

var scripts = [
    './src/**/*.js',
  ],
  tests = [
    './tests/**/*.js'
  ],
  allScripts = scripts.concat(tests);

/** Run all unit tests */
gulp.task('test', function() {
  return qunit('./tests/index.html');
});

/** Lint JavaScript */
gulp.task('jshint', function () {
  return gulp.src(allScripts)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

/** Concatenate and minify JavaScript */
gulp.task('scripts-prod', function () {
  return gulp.src(scripts)
    .pipe(plugins.concat('jquery.smoothState.min.js'))
    .pipe(plugins.uglify({preserveComments: 'some'}))
    // Output files
    .pipe(gulp.dest('dist/'))
    .pipe(plugins.size({title: 'scripts'}));
});

/** Concatenate and move a dev version to distribution */
gulp.task('scripts-dev', function () {
  return gulp.src(scripts)
    .pipe(plugins.concat('jquery.smoothState.js'))
    // Output files
    .pipe(gulp.dest('dist/'))
    .pipe(plugins.size({title: 'scripts'}));
});

/** Watch changes */
gulp.task('watch', function() {
  gulp.watch(allScripts, ['jshint', 'test']);
});

/** Default task */
gulp.task('default', ['jshint', 'test'], function() {
  gulp.start('scripts-prod');
  gulp.start('scripts-dev');
});
