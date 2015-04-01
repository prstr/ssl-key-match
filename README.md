# Check that SSL (X509) certificate matches it's private key

This tiny utility uses [Open SSL](https://openssl.org) to verify that:

  * input string or file is a valid PEM-encoded X509 certificate
  * input string or file is a valid PEM-encoded RSA private key
  * PEM-encoded X509 certificate matches PEM-encoded private RSA key
  * RSA private key is not encrypted with DES3 (does not require passphrase)
   
## Usage

```js
var ssl = require('ssl-key-match');

var certPem = fs.readFileSync('my-certificate.pem');
var keyPem = fs.readFileSync('my-key.pem');

ssl.match(certPem, keyPem, function(err, matches) {
  if (err)
    return console.error('Something\'s wrong: cert invalid, key invalid, key encrypted or else');
  if (matches)
    console.log('Yay, it matches.');
  else
    console.log('You\'ve picked the wrong key, bro.');
});

// or read directly from files (feeding them to openssl):

ssl.matchFiles('my-certificate.pem', 'my-key.pem', function(err, matches) {
  // ...
});
```
