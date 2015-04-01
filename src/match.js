"use strict";

var openssl = require('./openssl')
  , async = require('async');

/**
 * Verifies that SSL certificate matches private key.
 * This also ensures that private key is not itself encrypted with passphrase.
 *
 * Calls callback `cb` with error if:
 *
 *   * parsing/decoding error occurs
 *   * private key is encrypted
 *
 * If decoding is successful, but certificate does not match its private key,
 * then error will be `null` and second argument will be `false`.
 *
 * @param {string} certPem - PEM-encoded X509 certificate
 * @param {string} keyPem - PEM-encoded RSA private key
 * @param {function} cb - callback `function(err, matches)`
 * @module ssl-key-match/match
 * @function match
 */
var match = module.exports = exports = function(certPem, keyPem, cb) {

  async.parallel([
    openssl.thunk(['x509', '-noout', '-modulus'], certPem),
    openssl.thunk(['rsa', '-noout', '-modulus', '-passin', 'pass:'], keyPem)
  ], function(err, results) {
    /* istanbul ignore if */
    if (err) return cb(err);
    cb(null, results[0] == results[1]);
  });

};

/**
 * Same as {@link match} but accepts files instead of strings.
 *
 * @param {string} certFile - path to PEM-encoded X509 certificate
 * @param {string} keyFile - path to PEM-encoded RSA private key
 * @param {function} cb - callback `function(err, matches)`
 * @function files
 */
exports.files = function(certFile, keyFile, cb) {

  async.parallel([
    openssl.thunk(['x509', '-noout', '-modulus', '-in', certFile]),
    openssl.thunk(['rsa', '-noout', '-modulus',
      '-in', keyFile,
      '-passin', 'pass:'])
  ], function(err, results) {
    /* istanbul ignore if */
    if (err) return cb(err);
    cb(null, results[0] == results[1]);
  });

};
