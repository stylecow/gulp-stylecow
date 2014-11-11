var through = require('through2');
var stylecow = require('stylecow');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

module.exports = function (options) {
  stylecow.setConfig(options);

  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file); 
    if (file.isStream()) return cb(new PluginError('gulp-stylecow', 'Streaming not supported'));

    try {
      var css = stylecow.convert(file.contents.toString('utf8'));
    } catch (err) {
      return cb(new PluginError('gulp-stylecow', err));
    }

    file.contents = new Buffer(css.toCode());
    cb(null, file);
  }

  return through.obj(transform);
};
