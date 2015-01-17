'use strict';

var gulp = require('gulp'),
    plugins     = require('gulp-load-plugins')({ lazy: false }),
    buffer      = require('vinyl-buffer'),
    source      = require('vinyl-source-stream'),
    watchify    = require('watchify'),
    runSequence = require('run-sequence'),
    del = require('del'),
    browserify = require('browserify'),
    gutil = plugins.util,
    pkg = require('./package.json'),
    argv = require('minimist')(process.argv.slice(2)),
    minifyCSS = require('gulp-minify-css');


var paths = {
    lessPath: './public/less',
    bowerPath: './public/bower_components',
    fonts: ['./public/bower_components/bootstrap/fonts/*', './public/bower_components/font-awesome/fonts/*']
};

var jsLibs = require('./modules/jslibs');

gulp.task('clean', function(done) {
    del(['./public/css/*', './public/js/dist/*', './config/common.ini', './public/fonts/*'], done);
});

gulp.task('copy:config', function() {
    return gulp.src('./config/common_sample.ini', {base: './config'})
        .pipe(plugins.rename('./config/common.ini'))
        .pipe(gulp.dest('./'));
});

gulp.task('copy:fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('concat:devLibs', function() {
    return gulp.src(jsLibs(paths.bowerPath.replace('./', '')))
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest('./public/js/dist'));
});

gulp.task('less', function() {
    return gulp.src('./public/less/styles.less')
        .pipe(plugins.plumber())
        .pipe(plugins.less({
            paths: [
                paths.lessPath,
                paths.bowerPath
            ]
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('jshint', function() {
    return gulp.src(['./public/js/src/**/*.js'])
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('jshint-summary', {
            fileColCol: ',bold',
            positionCol: ',bold',
            codeCol: 'green,bold',
            reasonCol: 'cyan'
        }))
        .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('devDist', ['clean'], function (done) {
    runSequence(
        'copy:config',
        'copy:fonts',
        'concat:devLibs',
        'less',
        done);
});

gulp.task('browserify', function () {
    var bundler = browserify({
        cache: {}, packageCache: {}, fullPaths: true,
        entries: ['./public/js/src/submissions.js'],
        insertGlobals: true,
        debug: true
    });

    var rebundle = function () {
        return bundler
            .bundle()
            .pipe(source('submissions.js'))
            .pipe(plugins.duration('bundle time'))
            .pipe(buffer())
            .pipe(gulp.dest('./public/js/dist'))
            .pipe(plugins.livereload())
            .on('error', gutil.log);
    };

    if (process.env.NODE_ENV !== 'production') {
        bundler = watchify(bundler);
        bundler
            .on('update', function() {
                //to exclude jshint task pass -f argument
                if(!argv.f) {
                    return gulp.start(['jshint'], rebundle);
                }
                return rebundle();
            })
            .on('error', gutil.log);
    }

    return rebundle();
});

gulp.task('watch', ['browserify'], function (done) {
    gulp.watch('./public/less/*.less', ['less']);

    done();
});

gulp.task('nodemon', function () {
    return plugins.nodemon({ script: 'worker.js'});
});

gulp.task('livereload', function () {
    var lrserver = plugins.livereload();

    gulp.watch('./public/js/src/**/*.js').on('change', function(file) {
        lrserver.changed(file.path);
    });
});

gulp.task('dev', function (done) {
    runSequence(
        'devDist',
        'watch',
        'nodemon',
        done);
});

// Help
gulp.task('help', function(next) {
    gutil.log('--- ' + pkg.name + ' ---');
    gutil.log('');
    gutil.log('See all of the available tasks:');
    gutil.log('$ gulp -T');
    gutil.log('');
    gutil.log('Run a dev mode server:');
    gutil.log('$ gulp dev');
    gutil.log('');
    gutil.log('Run a prod mode server:');
    gutil.log('$ gulp prod');
    next();
});

// Default
gulp.task('default', ['help']);
