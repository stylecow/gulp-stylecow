"use strict"

let stylecow = require('../'),
    gutil    = require('gulp-util'),
    fs       = require('fs'),
    path     = require('path'),
    assert   = require('assert');

function createVinyl (cssFile, contents) {
    let base     = path.join(__dirname, 'fixtures'),
        filePath = path.join(base, cssFile);

    return new gutil.File({
        cwd: __dirname,
        base: base,
        path: filePath,
        contents: contents || fs.readFileSync(filePath)
    });
}

describe('gulp-stylecow', function () {
    describe('stylecow()', function () {
        it('should match fixtures/styles.css and expected/styles.css', function (done) {
            let input  = createVinyl('styles.css'),
                stream = stylecow(require('./fixtures/stylecow.json'));

            stream.once('data', function (cssFile) {
                assert.equal(cssFile.contents.toString(), fs.readFileSync(path.join(__dirname, 'expected/styles.css'), 'utf8'));
                done();
            });

            stream.write(input);
            stream.end();
        });
    });
});
