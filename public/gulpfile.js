const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const cache = require('gulp-cache');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

gulp.task('css', function(){
  let stream = gulp.src(['styles/main.scss','styles/*.scss'])
                   .pipe(plumber({
                     errorHandler: function (error) {
                       console.log(error.message);
                       this.emit('end');
                   }}))
                   .pipe(sass().on('error', sass.logError))
                   .pipe(concat('main.css'))
                   .pipe(gulp.dest('styles/'));

  stream = stream.pipe(rename({suffix: '.min'}))
                                    .pipe(cleanCSS());

  return stream.pipe(gulp.dest('styles/'));
});

gulp.task('default', function(){
  gulp.watch("styles/*.scss", ['css']);
});
