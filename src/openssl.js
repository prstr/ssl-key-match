'use strict';

var spawn = require('child_process').spawn
  , which = require('which');

/**
 * Invokes openssl _non-interactively_ with specified arguments array.
 *
 * @param {string} input - (optional) string to pass to openssl's stdin
 * @param {string[]} argv - array of arguments
 * @param {function} cb - callback `function(err, out)`
 * @module ssl-key-match/openssl
 * @function openssl
 */
var openssl = module.exports = exports = function (argv, input, cb) {
  which('openssl', function (err, openssl) {
    /* istanbul ignore if */
    if (err) return cb(err);
    if (typeof input == 'function') {
      cb = input;
      input = '';
    }
    var child = spawn(openssl, argv);
    var error = ''
      , output = '';
    child.stdin.end(input);
    child.stdout.on('data', function (data) {
      output += data.toString('binary');
    });
    child.stderr.on('data', function (data) {
      error += data.toString('binary');
    });
    child.on('close', function (code) {
      if (code > 0)
        cb(new Error(error));
      else
        cb(null, output);
    });
  });
};

/**
 * Same as {@link openssl}, but returns a function which accepts only callback.
 *
 * Convenient for {@link https://github.com/caolan/async}.
 */
openssl.thunk = function (argv, input) {
  return openssl.bind(openssl, argv, input);
};
