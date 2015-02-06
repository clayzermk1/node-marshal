# node-marshal

Parse Ruby's Marshal objects into JavaScript objects and JSON.

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

```javascript
//TODO
```

## Features / Limitations

### Supported

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

### Not supported

 * bigints
 * floats
 * classes
 * modules
 * regular expressions
 * others (see the [RubySpec Marshal spec](https://github.com/rubyspec/rubyspec/blob/archive/core/marshal))

## Notes

From what I can tell, positive integers are unsigned and negative integers are signed.
Thus, positive integers have twice the range as negative integers.
