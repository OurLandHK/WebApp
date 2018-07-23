var fs = require('fs');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

// create a handlebars helper to look up
// fingerprinted asset by non-fingerprinted name
var handlebarOpts = {
  helpers: {
    assetPath: function (path, context) {
      return ['/assets', context.data.root[path]].join('/');
    }
  }
};

gulp.task('default', function () {
  // read in our manifest file
  var manifest = JSON.parse(fs.readFileSync('./build/asset-manifest.json', 'utf8'));
  console.log(manifest);

  // read in our handlebars template, compile it using
  // our manifest, and output it to index.html
  return gulp.src('public/detailView.hbs')
    .pipe(handlebars(manifest, handlebarOpts))
    .pipe(rename('detailView.template.html'))
    .pipe(gulp.dest('functions/'));
});
