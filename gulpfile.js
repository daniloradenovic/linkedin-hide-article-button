var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

gulp.task('clean', function () {
    return del('dist/*');
});

gulp.task('copy-files', function () {
    return gulp.src(['manifest.json', 'style.css', 'icons/**/*', 'jquery-3.3.1.min.js'], { base: "."})
        .pipe(gulp.dest('dist'));
});

gulp.task('compress', function () {
    return gulp.src('script.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});

gulp.task('zip', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.series('clean', 'copy-files', 'compress', 'zip'));
