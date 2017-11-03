# node-marshal

[![Build Status](https://travis-ci.org/clayzermk1/node-marshal.svg)](https://travis-ci.org/clayzermk1/node-marshal)
[![Maintainability](https://api.codeclimate.com/v1/badges/aad4435e0049564ad670/maintainability)](https://codeclimate.com/github/clayzermk1/node-marshal/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/aad4435e0049564ad670/test_coverage)](https://codeclimate.com/github/clayzermk1/node-marshal/test_coverage)

Parse Ruby's Marshal strings into JavaScript objects/JSON.

This module could not have been built this without [this awesome blog post series](http://jakegoulding.com/blog/2013/01/15/a-little-dip-into-rubys-marshal-format/).

## Installation

`npm install marshal`

## Use

### Basic use

```javascript
var Marshal = require('marshal');
var m = new Marshal('0408220a68656c6c6f', 'hex');
console.log(m.parsed); // 'hello'
```

### Decode a Rails cookie

This library was purpose-built for sharing a Rails cookie with an Express session.

See [instore/rails-cookie-parser](https://github.com/instore/rails-cookie-parser) for an example.

## Features / Limitations

Able to convert a Marshal string into a JavaScript object (not all types are supported, if you see one you would like supported please create an issue). i.e. `Marshal.load()`

_**Unable**_ to convert a JavaScript object into a Marshal string. i.e. `Marshal.dump()`

### Supported Types

 * `nil` (converted to `null`)
 * booleans
 * integers
 * bignums
 * raw strings
 * symbols
 * symbol links
 * object links
 * IVARs (encoded strings, regular expressions are not supported)
 * arrays
 * objects
 * hashes

### Unsupported Types

 * floats
 * classes
 * modules
 * regular expressions
 * others (see the [RubySpec Marshal spec](https://github.com/ruby/spec/tree/master/core/marshal))

## Notes

From what I can tell, positive integers are unsigned and negative integers are signed.
Thus, positive integers have twice the range as negative integers.

## Acknowledgements

The bignum base conversion algorithm was adapted from [MikeMcl/decimal.js](https://github.com/MikeMcl/decimal.js) which is copyright Michael Mclaughlin.
