'use strict';

var gulp = require('gulp');
var styleguide = require('sc5-styleguide');
var conf = require('./conf');
var outputPath = conf.paths.tmp + '/sc5StyleGuide';
var scssFiles = conf.paths.src + '/**/*.scss';

var arrCssFiles = [
        //compiled scss
        conf.paths.tmp + '/serve/app/main.css',
        //bower files
        conf.paths.src + "/../bower_components/angular-material/angular-material.css",
        conf.paths.src + "/../bower_components/bootstrap/dist/css/bootstrap.min.css",
        conf.paths.src + "/../bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
        conf.paths.src + "/../bower_components/ui-select/dist/select.css",
        conf.paths.src + "/../bower_components/ngToast/dist/ngToast.css",
        conf.paths.src + "/../bower_components/v-accordion/dist/v-accordion.css",
        conf.paths.src + "/../bower_components/font-awesome/css/font-awesome.min.css",
        conf.paths.src + "/../bower_components/sc-date-time/dist/sc-date-time.css",
        conf.paths.src + "/../bower_components/fullcalendar/dist/fullcalendar.min.css",
        conf.paths.src + "/../bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css",
        conf.paths.src + "/../bower_components/tooltipster/css/tooltipster.css",
        conf.paths.src + "/../bower_components/tooltipster/css/themes/tooltipster-light.css",
        //custom files
        conf.paths.src + "/assets/libs/infinite-scroll/md-autocomplete-with-infinite-scroll.css",
        conf.paths.src + "/assets/libs/angular-side-by-side-select/angular-side-by-side-select.min.css"
    ];

gulp.task('styleguide:generate', function () {
    return gulp.src(scssFiles)
        .pipe(styleguide.generate({
            title: 'Drowz style guide',
            server: true,
            rootPath: outputPath,
            port: 3030,
            overviewPath: conf.paths.src + '/assets/styles/README.md'
        }))
        .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide:applystyles', function () {
    return gulp.src(arrCssFiles)
        .pipe(styleguide.applyStyles())
        .pipe(gulp.dest(outputPath));
});

gulp.task('watch', ['styleguide'], function () {
    // Start watching changes and update styleguide whenever changes are detected
    // Styleguide automatically detects existing server instance
    gulp.watch([scssFiles], ['styleguide']);
});

gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);

