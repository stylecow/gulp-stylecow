"use strict";

var through        = require('through2'),
    stylecow       = require('stylecow-core'),
    gutil          = require('gulp-util'),
    applySourceMap = require('vinyl-sourcemaps-apply'),
    PluginError    = gutil.PluginError,
    path           = require('path');

module.exports = function (config) {
  var tasks = new stylecow.Tasks();
  var coder = new stylecow.Coder(config.code);

  if (config.support) {
      tasks.minSupport(config.support);
  }

  if (config.plugins) {
      config.plugins.forEach(function (plugin) {
          tasks.use(require('stylecow-plugin-' + plugin));
      });
  }

  if (config.modules) {
      config.modules.forEach(function (module) {
          tasks.use(require(module));
      });
  }

  function transform (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError('gulp-stylecow', 'Streaming not supported'));
    }

    try {
      var css = stylecow.parse(file.contents.toString('utf8'), 'Root', null, file.path);
      tasks.run(css);
    } catch (err) {
      return cb(new PluginError('gulp-stylecow', err));
    }

    var code = coder.run(css, file.relative, file.sourceMap ? true : false, file.sourceMap);

    if (code.map && file.sourceMap) {
      let map = JSON.parse(code.map);
      map.file = file.sourceMap.file;
      applySourceMap(file, code.map);
    }

    file.contents = new Buffer(code.css);
    cb(null, file);
  }

  return through.obj(transform);
};
