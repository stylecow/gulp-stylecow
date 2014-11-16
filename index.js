var through = require('through2');
var stylecow = require('stylecow');
var gutil = require('gulp-util');
var applySourceMap = require('vinyl-sourcemaps-apply');
var PluginError = gutil.PluginError;
var path = require('path');

module.exports = function (options) {
  stylecow.setConfig(options);

  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file); 
    if (file.isStream()) return cb(new PluginError('gulp-stylecow', 'Streaming not supported'));

    stylecow.cwd(path.dirname(file.path));

    try {
      var css = stylecow.convert(file.contents.toString('utf8'));

      if (file.sourceMap && file.sourceMap.sources.length) {
        css.setData('sourceFile', file.relative);
      }
    } catch (err) {
      return cb(new PluginError('gulp-stylecow', err));
    }

    var code = new stylecow.Code(css, {
      style: options.code,
      sourceMap: file.sourceMap ? true : false
    });

    if (code.map && file.sourceMap) {
      applySourceMap(file, code.map.toString());
    }

    file.contents = new Buffer(code.code);
    cb(null, file);
  }

  return through.obj(transform);
};
