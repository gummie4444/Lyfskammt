// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint');




 
// JS hint task
gulp.task('jshint', function() {
  gulp.src('./app/*.js','./app/models/*.js','./config/*.js','./public/js/controllers/*.js','./public/js/*.js','./public/js/services/*.js','./*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});



