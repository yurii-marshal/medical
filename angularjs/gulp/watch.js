'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['scripts:watch', 'inject'], function () {

    gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

    gulp.watch([
      path.join(conf.paths.src, '/**/*.css'),
      path.join(conf.paths.src, '/**/*.scss')
    ], function(event) {
        if(isOnlyChange(event)) {
            gulp.start('styles-reload');
        } else {
            gulp.start('inject-reload');
        }
        // gulp.start('styleguide');
    });

    gulp.watch(path.join(conf.paths.src, '/**/*.html'), function(event) {
        browserSync.reload(event.path);
    });
});


