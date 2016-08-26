var debug = require('debug')('lib:bignum');

// Copied directly from https://github.com/MikeMcl/decimal.js/blob/fb37ca6bde56676d6d5a98df2bf8721e8fa81085/decimal.js#L27
// Base conversion alphabet.
var NUMERALS = '0123456789abcdef';

module.exports = (function () {
  function Bignum(rawString, encoding) {
    this.buffer = new Buffer(rawString);
    this.encoding = encoding;
    return this;
  }

  Bignum.prototype._getWordLength = function () {
    // the word length appears to always be positive but still follows the Marshal length logic
    var wordLength = this.buffer.readInt8(1); // read the number of "machine words" - 16bit integers
    if (wordLength === 0) {
      wordLength = 0;
    }
    else if (wordLength >= 6) {
      wordLength = wordLength - 5;
    }
    else if (wordLength <= -6) {
      wordLength = wordLength + 5;
    }

    debug('wordLength: %s', wordLength);

    return wordLength;
  }

  Bignum.prototype._readByteString = function () {
    // it appears that words are always zero padded - no odd number of bytes
    var byteLength = this._getWordLength() * 2;
    var byteString = '';
    var i, index;
    for (i = 0, index = 2; i < byteLength; i++, index++) {
      byteString = this.buffer.toString('hex', index, index + 1) + byteString;
    }

    debug('byteString: %s', byteString);

    return byteString;
  }

  Bignum.prototype._readBase10String = function () {
    var byteString = this._readByteString();

    // Modified from https://github.com/MikeMcl/decimal.js/blob/fb37ca6bde56676d6d5a98df2bf8721e8fa81085/decimal.js#L2597
    var base10Array = [0];
    var j, base10ArrayLength;
    for (i = 0; i < byteString.length; i++) {
      for (base10ArrayLength = base10Array.length; base10ArrayLength--;) {
        base10Array[base10ArrayLength] *= 16;
      }
      base10Array[0] += NUMERALS.indexOf(byteString.charAt(i));
      for (j = 0; j < base10Array.length; j++) {
        if (base10Array[j] > 10 - 1) {
          if (base10Array[j + 1] === void 0) {
            base10Array[j + 1] = 0;
          }
          base10Array[j + 1] += base10Array[j] / 10 | 0;
          base10Array[j] %= 10;
        }
      }
    }

    // trim leading zeros
    while (base10Array[base10Array.length] === 0) {
      base10Array.pop();
    }

    var base10String = base10Array.reverse().join('');
    debug('base10String: %s', base10String);

    return base10String;
  }

  Bignum.prototype.isNegative = function () {
    return (this.buffer.readInt8(0) === 0x2d); // read the sign byte and check for '-'
  }

  Bignum.prototype.toString = function () {
    var bignum = this._readBase10String();

    if (this.isNegative()) {
      bignum = '-' + bignum;
    }
    debug('bignum: %s', bignum);

    return bignum;
  };

  Bignum.prototype.toJSON = function () {
    return this.toString();
  };

  return Bignum;
})();
