'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var $ = require('gulp-load-plugins')();


function webpackWrapper(watch, test, callback) {
    var webpackOptions = {
        watch: watch,
        module: {
            preLoaders: [{test: /es6\.js$/, exclude: /node_modules/, loader: 'eslint-loader'}],
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loaders: ['ng-annotate', 'babel-loader?presets[]=es2015']
                },
                {
                    test: /\.html$/,
                    loader: "raw!html-minify"
                }],
            query: {
                esModules: true
            }
        },
        'html-minify-loader': {
            empty: true,        // KEEP empty attributes
            cdata: true,        // KEEP CDATA from scripts
            comments: false,     // KEEP comments
            dom: {                            // options of !(htmlparser2)[https://github.com/fb55/htmlparser2]
                lowerCaseAttributeNames: false,      // do not call .toLowerCase for each attribute name (Angular2 use camelCase attributes)
            }
        },
        output: {filename: 'index.module.js'}
    };

    if (watch) {
        webpackOptions.devtool = 'inline-source-map';
    }

    var webpackChangeHandler = function (err, stats) {
        if (err) {
            conf.errorHandler('Webpack')(err);
        }
        $.util.log(stats.toString({
            colors: $.util.colors.supportsColor,
            chunks: false,
            hash: false,
            version: false
        }));
        browserSync.reload();
        if (watch) {
            watch = false;
            callback();
        }
    };

    var sources = [path.join(conf.paths.src, '/index.module.js')];
    if (test) {
        sources.push(path.join(conf.paths.src, '/**/*.spec.js'));
    }

    return gulp.src(sources)
        .pipe(webpack(webpackOptions, null, webpackChangeHandler))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')));
}

gulp.task('scripts', function () {
    return webpackWrapper(false, false);
});

gulp.task('scripts:watch', ['scripts'], function (callback) {
    return webpackWrapper(true, false, callback);
});

gulp.task('scripts:test', function () {
    return webpackWrapper(false, true);
});

gulp.task('scripts:test-watch', ['scripts'], function (callback) {
    return webpackWrapper(true, true, callback);
});

gulp.task('scripts-copy', function () {
    return gulp.src(path.join(conf.paths.src, '/scripts/*.js'))
        .pipe($.size())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/scripts')));
});
