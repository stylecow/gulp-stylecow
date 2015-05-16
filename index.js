var through = require('through2');
var stylecow = require('stylecow');
var gutil = require('gulp-util');
var applySourceMap = require('vinyl-sourcemaps-apply');
var PluginError = gutil.PluginError;
var path = require('path');

module.exports = function (config) {

  if (config.support) {
      stylecow.minSupport(config.support);
  }

  if (config.plugins) {
      config.plugins.forEach(function (plugin) {
          stylecow.loadPlugin(plugin);
      });
  }

  if (config.modules) {
      config.modules.forEach(function (module) {
          stylecow.loadNpmModule(module);
      });
  }

  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file); 
    if (file.isStream()) return cb(new PluginError('gulp-stylecow', 'Streaming not supported'));

    stylecow.cwd(path.dirname(file.path));

    try {
      var css = stylecow.parse(file.contents.toString('utf8'), undefined, undefined, file.relative);
      stylecow.run(css);
    } catch (err) {
      return cb(new PluginError('gulp-stylecow', err));
    }

    var code = new stylecow.Coder(css, {
      file: file.relative,
      style: config.code,
      previousSourceMap: file.sourceMap,
      sourceMap: file.sourceMap ? true : false
    });

    if (code.map && file.sourceMap) {
      code.map.file = file.sourceMap.file;
      applySourceMap(file, code.map);
    }

    file.contents = new Buffer(code.code);
    cb(null, file);
  }

  return through.obj(transform);
};
