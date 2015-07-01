var debug = require('debug')('marshal');
var MarshalError = require('./marshalError');
var Ivar = require('./ivar');

var Marshal;

Marshal = (function () {
  function Marshal (buffer, encoding) {
    if (buffer !== void 0) this.load(buffer, encoding);

    return this;
  };

  Marshal.prototype._parse = function () {
    var typeCode = this.buffer.readUInt8(this._index++);
    debug('type code ' + '0x' + this.buffer.toString('hex', this._index - 1, this._index) + ' index ' + (this._index - 1));
    switch (typeCode) {
      case 0x30: // 0 - nil
        return null;
      case 0x54: // T - true
        return true;
      case 0x46: // F - false
        return false;
      case 0x69: // i - integer
        return this._parseInteger();
      case 0x22: // " - string
        return this._parseString();
      case 0x3A: // : - symbol
        return this._parseSymbol();
      case 0x3B: // ; - symbol symlink
        return this._parseSymbolLink();
      case 0x40: // @ - object link
        return this._parseObjectLink();
      case 0x49: // I - IVAR (encoded string or regexp)
        return this._parseIvar();
      case 0x5B: // [ - array
        return this._parseArray();
      case 0x6F: // o - object
        return this._parseObject();
      case 0x7B: // { - hash
        return this._parseHash();
      case 0x2F: // / - regexp
      case 0x63: // c - class
      case 0x6D: // m - module
      default:
        throw new MarshalError('unsupported typecode ' + typeCode, this);
    }
  };

  /** Parse an integer.
   * Used for reading of integer types and array lengths.
   * @return The decoded integer.
   */
  Marshal.prototype._parseInteger = function () {
    var small = this.buffer.readInt8(this._index++); // read a signed byte
    if (small === 0) {
      return 0;
    }
    else if (small >= 6) {
      return small - 5;
    }
    else if (small <= -6) {
      return small + 5;
    }
    else if (small === 1) {
      var large = this.buffer.readUInt8(this._index++);
      return large;
    }
    else if (small === 2) {
      var large = this.buffer.readUInt16LE(this._index);
      this._index += 2;
      return large;
    }
    else if (small === 3) {
      var large = new Buffer(this.buffer.toString('hex', this._index, this._index + 3) + '00', 'hex').readUInt32LE(0);
      this._index += 3;
      return large;
    }
    else if (small === 4) {
      var large = this.buffer.readUInt32LE(this._index);
      this._index += 4;
      return large;
    }
    else if (small === -1) {
      var large = this.buffer.readInt8(this._index++);
      if (large >= 0 && large <= 127) {
        return large - 256;
      } else {
        return large;
      }
    }
    else if (small === -2) {
      var large = this.buffer.readInt16LE(this._index);
      this._index += 2;
      return large;
    }
    else if (small === -3) {
      var large = new Buffer(this.buffer.toString('hex', this._index, this._index + 3) + 'ff', 'hex').readInt32LE(0);
      this._index += 3;
      return large;
    }
    else if (small === -4) {
      var large = this.buffer.readInt32LE(this._index);
      this._index += 4;
      return large;
    }
    else {
      throw new MarshalError('unable to parse integer', this);
    }

    // add the sign
    if (small > 0) {
      return large;
    }
    else {
      return -large;
    }
  };

  Marshal.prototype._parseArray = function () {
    // a = ['foo', 'bar']
    // \x04\b[\aI\"\bfoo\x06:\x06ETI\"\bbar\x06;\x00T
    var arr = [];
    var length = this._parseInteger();
    if (length > 0) {
      var value;
      while (arr.length < length) {
        value = this._parse();
        arr.push(value);
      }
    }
    return arr;
  };

  Marshal.prototype._parseObject = function () {
    // Object.new
    // \x04\bo:\vObject\x00
    // o.instance_variable_set(:@foo, 'bar')
    // \x04\bo:\vObject\x06:\t@fooI\"\bbar\x06:\x06ET
    // o.instance_variable_set(:@bar, 'baz')
    // \x04\bo:\vObject\a:\t@fooI\"\bbar\x06:\x06ET:\t@barI\"\bbaz\x06;\aT

    // symbol name
    this._index++;
    var name = this._parseSymbol();

    // hash
    var object = this._parseHash();

    // attach name
    object['_name'] = name;

    return object;
  };

  Marshal.prototype._parseHash = function () {
    // {"first"=>"john", "middle"=>"clay", "last"=>"walker", "age"=>28}
    // \x04\b{\tI\"\nfirst\x06:\x06ETI\"\tjohn\x06;\x00TI\"\vmiddle\x06;\x00TI\"\tclay\x06;\x00TI\"\tlast\x06;\x00TI\"\vwalker\x06;\x00TI\"\bage\x06;\x00Ti!
    var hash = {};
    var length = this._parseInteger();
    if (length > 0) {
      var key, value;
      while (Object.keys(hash).length < length) {
        key = this._parse();
        value = this._parse();
        hash[key] = value;
      }
    }
    return hash;
  };

  Marshal.prototype._parseSymbol = function () {
    var symbol = this._parseString();
    this._symbols.push(symbol);
    return symbol;
  };

  Marshal.prototype._parseSymbolLink = function () {
    var index = this._parseInteger();
    var symbol = this._symbols[index];
    return symbol;
  };

  Marshal.prototype._parseObjectLink = function () {
    var index = this._parseInteger();
    var object = this._objects[index];
    return object;
  };

  Marshal.prototype._parseString = function () {
    var length = this._parseInteger();
    var string = this.buffer.slice(this._index, this._index + length).toString();
    this._index += length;
    return string;
  };

  Marshal.prototype._parseIvar = function () {
    var string = this._parse();

    var encoding;
    var lengthOfSymbolChar = this._parseInteger();
    if (lengthOfSymbolChar === 1) {
      // one character coming up, hopefully a symbol, treat it as a typecode
      var symbol = this._parse();
      var value = this._parse();
      this._objects.push(value); // values are saved in the object cache before the ivar

      if (symbol === "E") {
        // E means we have a common encoding, the following boolean determines UTF-8 or ASCII
        if (value === true) {
          encoding = 'utf8';
        }
        else {
          encoding = 'ascii';
        }
      }
      else if (symbol === 'encoding') {
        // encoding means we have some other encoding
        encoding = value;
      }
      else {
        throw new MarshalError('invalid IVAR encoding specification ' + symbol, this);
      }
    }
    else {
      throw new MarshalError('invalid IVAR, expected a single character', this);
    }

    var ivar = new Ivar(string, encoding);
    this._objects.push(ivar); // completed ivars are saved in the object cache
    debug('ivar ' + ivar);
    return ivar.toString();
  };

  Marshal.prototype.load = function (buffer, encoding) {
    if (buffer === void 0 || buffer.length === 0) {
      throw new MarshalError('no buffer specified', this);
    }
    else if (buffer instanceof Buffer) {
      this.buffer = buffer;
    }
    else {
      this.buffer = new Buffer(buffer, encoding);
    }
    debug('buffer length ' + this.buffer.length);

    // reset the index
    this._index = 0;

    // parse Marshal version
    this._version = this.buffer.readUInt8(this._index++) + '.' + this.buffer.readUInt8(this._index++);

    // create cache tables
    this._symbols = [];
    this._objects = [];

    if (this._index < this.buffer.length) {
      this.parsed = this._parse();
    }

    return this;
  };

  // Marshal.prototype.dump = function () {
  //   //TODO
  // };

  Marshal.prototype.toString = function (encoding) {
    return this.buffer.toString(encoding || 'base64');
  };

  Marshal.prototype.toJSON = function () {
    return this.parsed;
  };

  return Marshal;
})();

module.exports = Marshal;
