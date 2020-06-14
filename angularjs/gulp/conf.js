/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');

var argv = require('yargs')
    .option('nv', {
        alias: 'nupkg-version',
        demand: true,
        default: '1.0.0',
        describe: 'nuget package version',
        type: 'string'
    })
    .option('no', {
        alias: 'nupkg-out-path',
        demand: true,
        default: '',
        describe: 'nuget package output dir',
        type: 'string'
    })
    .option('op', {
        alias: 'output-path',
        demand: true,
        default: 'dist',
        describe: 'build output',
        type: 'string'
    }).argv;

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
    src: 'app',
    dist: argv.op,
    tmp: '.tmp',
    e2e: 'e2e'
};

exports.nupkg = {
    name: "NikoHealth.UI",
    version: argv.nv,
    authors: "Nikolai Komlichenko, Sergey Kirichenko",
    owners: "Glorium Technologies",
    description: "NikoHealth DME UI",
    outputDir: argv.no
};

exports.css = {
    "mainSrc": "/assets/styles/",
    "sassSrc": "/**/assets/**/*.scss"
}

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
    directory: 'bower_components',
    exclude: [/bower_components\/moment-timezone/]
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
    'use strict';

    return function (err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};

