# gulp-stylecow

> Execute stylecow plugins with gulp

## Usage

There are two ways to use this plugin. The standard way:

```javascript
var stylecow = require('gulp-stylecow');

gulp.task('stylecow', function() {
  gulp.src('./src/*.css')
    .pipe(stylecow(require('./stylecow.json')))
    .pipe(gulp.dest('./public/'))
});
```

The easier way, using the stylecow.json file:

```javascript
var stylecow = require('gulp-stylecow');

gulp.task('stylecow', function() {
    var transform = stylecow.load(require('./stylecow.json'));

    gulp.src(transform.input())     // load input file
        .pipe(transform.run())      // run the plugins
        .pipe(transform.output())   // rename to output
        .pipe(gulp.dest('./'));
});
```
