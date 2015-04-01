"use strict";

var spawn = require('child_process').spawn
  , which = require('which');

/**
 * Invokes openssl _non-interactively_ with specified arguments array.
 *
 * @param {string[]} argv - array of arguments
 * @param {function} cb - callback `function(err, out)`
 */
module.exports = function(argv, cb) {
  which('openssl', function(err, openssl) {
    /* istanbul ignore if */
    if (err) return cb(err);
    var child = spawn(openssl, argv);
    var error = ''
      , output = '';
    child.stdin.end();
    child.stdout.on('data', function(data) {
      output += data.toString('binary');
    });
    child.stderr.on('data', function(data) {
      error += data.toString('binary');
    });
    child.on('close', function(code) {
      if (code > 0)
        cb(new Error(error));
      else
        cb(null, output, error);
    });
  });
};
