"use strict";

var openssl = require('../src/openssl')
  , assert = require('assert');

describe('openssl', function() {

  it('should execute openssl without arguments', function(cb) {

    openssl([], function(err, out) {
      if (err) return cb(err);
      assert.equal(out, 'OpenSSL> ');
      cb();
    });

  })

});
