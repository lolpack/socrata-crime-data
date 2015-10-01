var gulp = require('gulp');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var hbsfy = require('hbsfy');
var jshint = require('gulp-jshint');

gulp.task('browserify', function() {
  gulp.src('src/js/main.js')
    .pipe(browserify({transform: 'hbsfy'}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
  gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'));
  // Only using plain css for now, will use less if I have time
  gulp.src('src/css/**/*')
    .pipe(gulp.dest('dist/css'));
  gulp.src('src/font-awesome/**/*')
    .pipe(gulp.dest('dist/font-awesome'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*.*', ['build']);
});

gulp.task('lint', function () {
  gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('default', ['watch']);

gulp.task('build', ['browserify', 'copy']);
