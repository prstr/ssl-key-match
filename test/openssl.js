'use strict';

var openssl = require('../src/openssl')
  , fs = require('fs')
  , assert = require('assert');

describe('openssl', function () {

  it('should execute openssl without arguments', function (cb) {

    openssl([], function (err, out) {
      if (err) return cb(err);
      assert.equal(out, 'OpenSSL> ');
      cb();
    });

  });

  it('should read unencrypted keys', function (cb) {
    openssl(['rsa', '-modulus', '-noout',
      '-passin', 'pass:',
      '-in', 'test/key.pem'], function (err, out) {
      if (err) return cb(err);
      assert.equal(out.indexOf('Modulus='), 0);
      cb();
    });
  });

  it('should bounce on encrypted keys', function (cb) {
    openssl(['rsa', '-modulus', '-noout',
      '-passin', 'pass:',
      '-in', 'test/key.encrypted.pem'], function (err) {
      assert.ok(err);
      cb();
    });
  });

  it('should read accept string input', function (cb) {
    var key = fs.readFileSync('test/key.pem');
    openssl(['rsa', '-modulus', '-noout', '-passin', 'pass:'],
      key,
      function (err, out) {
        if (err) return cb(err);
        assert.equal(out.indexOf('Modulus='), 0);
        cb();
      });
  });

});
