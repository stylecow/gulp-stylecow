# gulp-stylecow

> Execute stylecow plugins with gulp

## Usage

### Common way:

```js
var stylecow = require('gulp-stylecow');

gulp.task('stylecow', function() {
    gulp.src('./src/*.css')
        .pipe(stylecow({
            code: 'minify',
            plugins: [
                'color',
                'variables',
                'import',
                'flex',
                'prefixes',
                'fixes'
            ]
        }))
        .pipe(gulp.dest('./public/'));
});
```

### Using stylecow.json file

```js
var stylecow = require('gulp-stylecow'),
    rename   = require('gulp-rename');

gulp.task('stylecow', function() {
    var config = require('./stylecow.json');

    stylecow.src(config.files).forEach(function (file) {
        gulp.src(file.input)
            .pipe(stylecow(config))
            .pipe(rename(file.output))
            .pipe(gulp.dest('./'));
    });
});
```
