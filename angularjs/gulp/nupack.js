'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var nugetpack = require('gulp-nuget-pack');

// Nuget
gulp.task('nuget', ['build'], function(callback) {
    nugetpack({
            id: conf.nupkg.name,
            version: conf.nupkg.version,
            outputDir: conf.nupkg.outputDir,
            authors: conf.nupkg.authors,
            owners: conf.nupkg.owners,
            description: conf.nupkg.description
        },
        [
            {
                src: conf.paths.dist,
                dest: "/"
            }
        ],
    callback);
});
