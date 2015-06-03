'use strict';

var gulp = require('gulp'),
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
  return gulp.src('./tests/index.html')
        .pipe(plugins.qunit());
});

/** Lint JavaScript */
gulp.task('jshint', function () {
  return gulp.src(allScripts)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

/** Concatenate and minify JavaScript */
gulp.task('uglify', function () {
  return gulp.src(scripts)
    .pipe(plugins.concat('jquery.smoothState.min.js'))
    .pipe(plugins.uglify({preserveComments: 'some'}))
    .pipe(gulp.dest('./'))
    .pipe(plugins.size({title: 'scripts'}));
});

/** Watch changes */
gulp.task('watch', function() {
  gulp.watch(allScripts, ['jshint', 'test']);
});

/** Default task */
gulp.task('default', ['jshint', 'test'], function() {
  gulp.start('uglify');
});
