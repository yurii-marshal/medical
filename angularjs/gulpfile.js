/*
* 	Gulp tasks
* 	1. gulp - run development server
	2. gulp serve - same as gulp
	3. gulp build - makes build
	4. gulp serve:dist - makes build and run server on it
	5. gulp nuget - makes build and create nuget package form it
*
* */

'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
	return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
	require('./gulp/' + file);
});

gulp.task('default', function () {
	gulp.start('serve');
});
