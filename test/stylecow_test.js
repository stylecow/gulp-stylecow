var stylecow = require('../');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

function createVinyl (cssFile, contents) {
  var base = path.join(__dirname, 'fixtures');
  var filePath = path.join(base, cssFile);

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
			var input = createVinyl('styles.css');
			var stream = stylecow(require('./fixtures/stylecow.json'));

			stream.once('data', function (cssFile) {
				assert.equal(cssFile.contents.toString(), fs.readFileSync(path.join(__dirname, 'expected/styles.css'), 'utf8'));
				done();
			});

			stream.write(input);
			stream.end();
		});
	});
});
