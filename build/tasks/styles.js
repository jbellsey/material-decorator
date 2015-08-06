var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    paths = require('../paths');


//  EFFECTS: compiles all LESS files in the app
//          generates "app.css" in dest dir (uncompressed)
//          and "app.min.css" in dest dir (compressed)
//
gulp.task('build-styles', function() {

    // this one file is sufficient; it imports the rest of them
    //
    return gulp.src(paths.styleInput)

        .pipe(less())

        // autoprefix for cross-browser goodness
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))

        // store an uncompressed version in the destination directory as "app.css"
        .pipe(rename('app.css'))
        .pipe(gulp.dest(paths.output))

        // and a minified version in the destination directory as "app.min.css"
        .pipe(minifyCss())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest(paths.output));
});
