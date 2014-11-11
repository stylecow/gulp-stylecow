# gulp-stylecow

> Execute stylecow plugins with gulp

## Usage

```javascript
var stylecow = require('gulp-stylecow');

gulp.task('stylecow', function() {
  gulp.src('./src/*.css')
    .pipe(stylecow(require('./stylecow.json)))
    .pipe(gulp.dest('./public/'))
});
```
