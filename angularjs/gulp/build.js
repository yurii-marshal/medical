'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
const fs = require('fs');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var babel = require("gulp-babel");
var lazypipe = require('lazypipe');
var gulpif = require('gulp-if');

function isEs6(file) {
    return file.path.match(/^(.*?)\.es6\.js$/g);
}

function isNotHtml(file) {
    return !file.path.match(/^(.*?)\.html$/g);
}

var es6Compiler = lazypipe()
    .pipe(()=>
        gulpif(isEs6, babel({ presets: ['es2015'] }))
    );

var merge = require('merge-stream');

gulp.task('partials', ['other'], function () {
  return gulp.src([
        path.join(conf.paths.src, '/**/*.html'),
        path.join(conf.paths.tmp, '/serve/app/**/*.html'),
        path.join('!' + conf.paths.src, '/index.html'),
        path.join('!' + conf.paths.tmp, '/serve/app/index.html')
      ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'app',
        root: ''
      }))
      .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {

    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/*.js'), { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var htmlFilter = $.filter('*.html', { restore: true });
    var jsFilter = $.filter('**/*.js', { restore: true });
    var cssFilter = $.filter('**/*.css', { restore: true });

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.removeHtml())
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref({}, es6Compiler))
        .pipe(gulpif(isNotHtml, $.rev()))
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe(jsFilter.restore)
        .pipe($.revReplace())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

gulp.task("build", ['pre-build'], function() {

    var styles = gulp.src(path.join(conf.paths.dist, '/styles/*.css'))
        .pipe($.cleanCss())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/styles/')))
        .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));

    var scripts = gulp.src([
          path.join(conf.paths.dist, '/scripts/*.js'),
          path.join('!' + conf.paths.tmp, '/serve/**/*.js')
        ])
        // .pipe($.sourcemaps.init())
        .pipe($.ngAnnotate())
        .pipe($.uglify({ mangle: false, compress:true, output: { beautify: false } }))
        // .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/scripts/')))
        .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));

    return merge(styles, scripts);
});

gulp.task('other', ['clean', 'clean_bower'], function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
      ])
      .pipe(fileFilter)
      .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('pre-build', ['html'], function () {
    return gulp.src(path.join(conf.paths.src, 'config.js'))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

