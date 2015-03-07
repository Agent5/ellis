var gulp = require('gulp'),
  connect = require('gulp-connect'),
  watch = require('gulp-watch');

gulp.task('webserver', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('livereload', function() {
  gulp.src(['css/*.css', 'index.html'])
    .pipe(watch('css/*.css'))
    .pipe(watch('index.html'))
    .pipe(watch('js/*.js'))
    .pipe(connect.reload());
});

// gulp.task('livereload', function() {
//   gulp.src(['index.html'])
//     .pipe(watch('index.html'))
//     .pipe(connect.reload());
// });

gulp.task('watch', function() {
    gulp.watch('css/*.css');
});

gulp.task('watch', function() {
    gulp.watch('index.html');
});

gulp.task('watch', function() {
    gulp.watch('js/*.js');
});

gulp.task('default', ['webserver', 'livereload', 'watch']);