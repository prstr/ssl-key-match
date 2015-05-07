'use strict';

var sslMatch = require('../src/match')
  , fs = require('fs')
  , assert = require('assert');

describe('ssl cert/key match', function () {

  it('should match certificate and private keys', function (cb) {
    var certPem = fs.readFileSync('test/cert.pem')
      , keyPem = fs.readFileSync('test/key.pem');
    sslMatch(certPem, keyPem, function (err, matches) {
      if (err) return cb(err);
      assert(matches);
      cb();
    });
  });

  it('should bounce on encrypted private keys', function (cb) {
    var certPem = fs.readFileSync('test/cert.pem')
      , keyPem = fs.readFileSync('test/key.encrypted.pem');
    sslMatch(certPem, keyPem, function (err) {
      assert.ok(err);
      cb();
    });
  });

  it('should bounce on incorrect cert', function (cb) {
    var certPem = 'nonsense'
      , keyPem = fs.readFileSync('test/key.pem');
    sslMatch(certPem, keyPem, function (err) {
      assert.ok(err);
      cb();
    });
  });

  it('should bounce on incorrect private keys', function (cb) {
    var certPem = fs.readFileSync('test/cert.pem')
      , keyPem = 'nonsense';
    sslMatch(certPem, keyPem, function (err) {
      assert.ok(err);
      cb();
    });
  });

  it('should not match certificate with wrong private keys', function (cb) {
    var certPem = fs.readFileSync('test/cert.pem')
      , keyPem = fs.readFileSync('test/key.wrong.pem');
    sslMatch(certPem, keyPem, function (err, matches) {
      if (err) return cb(err);
      assert(!matches);
      cb();
    });
  });

});

describe('ssl cert/key match.files', function () {

  it('should match certificate and private keys', function (cb) {
    sslMatch.files('test/cert.pem', 'test/key.pem', function (err, matches) {
      if (err) return cb(err);
      assert(matches);
      cb();
    });
  });

  it('should bounce on encrypted private keys', function (cb) {
    sslMatch.files('test/cert.pem', 'test/key.encrypted.pem', function (err) {
      assert.ok(err);
      cb();
    });
  });

  it('should not match certificate with wrong private keys', function (cb) {
    sslMatch.files('test/cert.pem', 'test/key.wrong.pem', function (err, matches) {
      if (err) return cb(err);
      assert(!matches);
      cb();
    });
  });

});

