"use strict";

var through        = require('through2'),
    stylecow       = require('stylecow-core'),
    plugins        = require('stylecow-plugins'),
    gutil          = require('gulp-util'),
    applySourceMap = require('vinyl-sourcemaps-apply'),
    PluginError    = gutil.PluginError,
    glob           = require('glob'),
    path           = require('path');

module.exports = function (config) {
    let tasks = new stylecow.Tasks();
    let coder = new stylecow.Coder(config.code);

    if (config.support) {
        tasks.minSupport(config.support);
    }

    tasks.use(plugins(config.plugins));

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

        let css, code, map;

        try {
            css = stylecow.parse(file.contents.toString('utf8'), 'Root', null, file.path);
            tasks.run(css);
        } catch (err) {
            return cb(new PluginError('gulp-stylecow', err));
        }

        if (file.sourceMap) {
            coder.sourceMap('none');
            code = coder.run(css, file.relative, file.sourceMap);

            map = JSON.parse(code.map);
            map.file = file.sourceMap.file;
            applySourceMap(file, map);
        } else {
            if (config.map) {
                coder.sourceMap(config.map);
            }

            code = coder.run(css);
        }

        file.contents = new Buffer(code.css);
        cb(null, file);
    }

    return through.obj(transform);
};

module.exports.src = function(files) {
    let resolved = [];

    files.forEach(function (file) {
        if (!glob.hasMagic(file.input)) {
            return resolved.push(file);
        }

        glob
            .sync(file.input)
            .forEach(function (input) {
                let info = path.parse(input);

                resolved.push({
                    input: input,
                    output: file.output
                        .replace('[dir]', info.dir)
                        .replace('[base]', info.base)
                        .replace('[ext]', info.ext)
                        .replace('[name]', info.name)
                });
            });
    });

    return resolved;
}
