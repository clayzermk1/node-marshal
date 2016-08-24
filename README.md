# node-marshal

[![Build Status](https://travis-ci.org/instore/node-marshal.svg)](https://travis-ci.org/instore/node-marshal)
[![Code Climate](https://codeclimate.com/github/instore/node-marshal/badges/gpa.svg)](https://codeclimate.com/github/instore/node-marshal)
[![Test Coverage](https://codeclimate.com/github/instore/node-marshal/badges/coverage.svg)](https://codeclimate.com/github/instore/node-marshal/coverage)

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
 * integers (up to 32bit, bigints are not supported)
 * raw strings
 * symbols
 * symbol links
 * object links
 * IVARs (encoded strings, regular expressions are not supported)
 * arrays
 * objects
 * hashes

### Unsupported Types

 * bigints
 * floats
 * classes
 * modules
 * regular expressions
 * others (see the [RubySpec Marshal spec](https://github.com/ruby/spec/tree/master/core/marshal))

## Notes

From what I can tell, positive integers are unsigned and negative integers are signed.
Thus, positive integers have twice the range as negative integers.
