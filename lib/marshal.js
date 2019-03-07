const Ivar = require('./ivar')
const MarshalError = require('./marshalError')
const { debug, IS_DEBUG } = require('./debug')

const HEX_TO_DEC_MAP = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }
// const HEX_TO_DEC_MAP = '0123456789abcdef'.split('').reduce((o, v, i) => {
//   o[ v ] = i
//   return o
// }, {})

const _parseInt8 = (marshal) => {
  const value = marshal.buffer.readInt8(marshal._index)
  marshal._index += 1
  return value
}
const _parseInt8LE = (marshal) => { // TODO: simpler value calc?
  const value = -(
    ~(
      0xffffff00 + marshal.buffer.readUInt8(marshal._index)
    ) + 1
  )
  marshal._index += 1
  return value
}
const _parseInt16LE = (marshal) => {
  const value = marshal.buffer.readInt16LE(marshal._index)
  marshal._index += 2
  return value
}
const _parseInt24LE = (marshal) => { // TODO: simpler value calc?
  const value = -(
    ~(
      (
        (0xffff0000 + marshal.buffer.readUInt16LE(marshal._index + 1)) << 8
      ) + marshal.buffer.readUInt8(marshal._index)
    ) + 1
  )
  marshal._index += 3
  return value
}
const _parseInt32LE = (marshal) => {
  const value = marshal.buffer.readInt32LE(marshal._index)
  marshal._index += 4
  return value
}
const _parseUInt8 = (marshal) => {
  const value = marshal.buffer.readUInt8(marshal._index)
  marshal._index += 1
  return value
}
const _parseUInt16LE = (marshal) => {
  const value = marshal.buffer.readUInt16LE(marshal._index)
  marshal._index += 2
  return value
}
const _parseUInt24LE = (marshal) => {
  const value = Buffer.from( // TODO: less buffer/string convert?
    marshal.buffer.toString('hex', marshal._index, marshal._index + 3) + '00',
    'hex'
  ).readUInt32LE(0)
  marshal._index += 3
  return value
}
const _parseUInt32LE = (marshal) => {
  const value = marshal.buffer.readUInt32LE(marshal._index)
  marshal._index += 4
  return value
}
const _parseBuffer = (marshal, byteLength) => {
  const buffer = marshal.buffer.slice(marshal._index, marshal._index + byteLength)
  marshal._index += byteLength
  return buffer
}
const _parseByteString = (marshal, byteLength) => {
  let byteString = ''
  let index = marshal._index
  let indexMax = marshal._index + byteLength
  for (; index < indexMax; index++) {
    byteString = marshal.buffer.toString('hex', index, index + 1) + byteString
  }
  marshal._index += byteLength
  return byteString
}

const _parse = (marshal) => {
  const typeCode = _parseUInt8(marshal)

  IS_DEBUG && debug('type code 0x%s index %d',
    marshal.buffer.toString('hex', marshal._index - 1, marshal._index),
    marshal._index - 1
  )

  switch (typeCode) {
    case 0x30: // 0 - nil
      return null
    case 0x54: // T - true
      return true
    case 0x46: // F - false
      return false
    case 0x69: // i - integer
      return _parseInteger(marshal)
    case 0x22: // " - string
      return _parseString(marshal)
    case 0x3a: // : - symbol
      return _parseSymbol(marshal)
    case 0x3b: // ; - symbol symlink
      return _parseSymbolLink(marshal)
    case 0x40: // @ - object link
      return _parseObjectLink(marshal)
    case 0x49: // I - IVAR (encoded string or regexp)
      return _parseIvar(marshal)
    case 0x5b: // [ - array
      return _parseArray(marshal)
    case 0x6f: // o - object
      return _parseObject(marshal)
    case 0x7b: // { - hash
      return _parseHash(marshal)
    case 0x6c: // l - bignum
      return _parseBignum(marshal)
    case 0x66: // f - float
      return _parseFloat(marshal)
    case 0x2f: // / - regexp
    case 0x63: // c - class
    case 0x6d: // m - module
    default:
      throw new MarshalError(`unsupported typecode ${typeCode}`, marshal)
  }
}

const _parseTypeLength = (marshal) => {
  const length = marshal.buffer.readInt8(marshal._index) // read the number of "machine words" - 16bit integers
  marshal._index += 1
  return length >= 6 ? length - 5
    : length <= -6 ? length + 5
      : length
}

/** Parse a float.
 * @return The decoded float.
 */
const _parseFloat = (marshal) => {
  const floatString = _parseBuffer(marshal, _parseTypeLength(marshal)).toString('utf8') // TODO: use `ascii`
  return floatString === 'inf' ? Infinity
    : floatString === '-inf' ? -Infinity
      : floatString === 'nan' ? NaN
        : parseFloat(floatString)
}

/** Parse a bignum.
 * @return The decoded bignum.
 */
const _parseBignum = (marshal) => {
  const isNegative = _parseInt8(marshal) === 0x2d // read the sign byte and check for '-'
  debug('isNegative: %s', isNegative)

  // the word length appears to always be positive but still follows the Marshal length logic
  const byteLength = _parseTypeLength(marshal) * 2
  debug('byteLength: %s', byteLength)

  // it appears that words are always zero padded - no odd number of bytes
  const byteString = _parseByteString(marshal, byteLength)
  debug('byteString: %j', byteString)

  // Modified from https://github.com/MikeMcl/decimal.js/blob/fb37ca6bde56676d6d5a98df2bf8721e8fa81085/decimal.js#L2597
  const base10Array = [ 0 ]
  for (let i = 0; i < byteString.length; i++) {
    for (let base10ArrayLength = base10Array.length; base10ArrayLength--;) {
      base10Array[ base10ArrayLength ] *= 16
    }
    base10Array[ 0 ] += HEX_TO_DEC_MAP[ byteString.charAt(i) ]
    for (let j = 0; j < base10Array.length; j++) {
      if (base10Array[ j ] > 10 - 1) {
        if (base10Array[ j + 1 ] === undefined) base10Array[ j + 1 ] = 0
        base10Array[ j + 1 ] += (base10Array[ j ] / 10) | 0
        base10Array[ j ] %= 10
      }
    }
  }

  // trim leading zeros
  while (base10Array[ base10Array.length ] === 0) {
    base10Array.pop()
  }

  base10Array.reverse()
  debug('base10Array: %j', base10Array)

  if (isNegative) {
    base10Array.unshift('-')
  }

  let bignum = base10Array.join('')
  debug('bignum: %s', bignum)

  return bignum
}

/** Parse an integer.
 * Used for reading of integer types and array lengths.
 * @return The decoded integer.
 */
const _parseInteger = (marshal) => {
  let small = _parseInt8(marshal) // read a signed byte

  switch (small) {
    case 0:
      return 0
    case 1:
      return _parseUInt8(marshal)
    case 2:
      return _parseUInt16LE(marshal)
    case 3:
      return _parseUInt24LE(marshal)
    case 4:
      return _parseUInt32LE(marshal)
    case-1:
      return _parseInt8LE(marshal)
    case-2:
      return _parseInt16LE(marshal)
    case-3:
      return _parseInt24LE(marshal)
    case-4:
      return _parseInt32LE(marshal)
  }

  if (small >= 6) return small - 5
  if (small <= -6) return small + 5

  throw new MarshalError('unable to parse integer', marshal)
}

const _parseArray = (marshal) => {
  // a = ['foo', 'bar']
  // \x04\b[\aI\"\bfoo\x06:\x06ETI\"\bbar\x06;\x00T
  const array = []
  let arrayLength = _parseInteger(marshal)
  while (arrayLength > 0) {
    array.push(_parse(marshal))
    arrayLength--
  }
  return array
}

const _parseObject = (marshal) => {
  // Object.new
  // \x04\bo:\vObject\x00
  // o.instance_variable_set(:@foo, 'bar')
  // \x04\bo:\vObject\x06:\t@fooI\"\bbar\x06:\x06ET
  // o.instance_variable_set(:@bar, 'baz')
  // \x04\bo:\vObject\a:\t@fooI\"\bbar\x06:\x06ET:\t@barI\"\bbaz\x06;\aT

  // symbol name - either a symbol or a symbol link
  const name = _parse(marshal)

  // hash
  const object = _parseHash(marshal)

  // attach name
  object[ '_name' ] = name

  return object
}

const _parseHash = (marshal) => {
  // {"first"=>"john", "middle"=>"clay", "last"=>"walker", "age"=>28}
  // \x04\b{\tI\"\nfirst\x06:\x06ETI\"\tjohn\x06;\x00TI\"\vmiddle\x06;\x00TI\"\tclay\x06;\x00TI\"\tlast\x06;\x00TI\"\vwalker\x06;\x00TI\"\bage\x06;\x00Ti!
  const hashObject = {}
  let hashObjectLength = _parseInteger(marshal)
  while (hashObjectLength > 0) {
    const key = _parse(marshal)
    hashObject[ key ] = _parse(marshal)
    hashObjectLength--
  }
  return hashObject
}

const _parseSymbol = (marshal) => {
  const symbolString = _parseString(marshal)
  marshal._symbols.push(symbolString)
  return symbolString
}

const _parseSymbolLink = (marshal) => {
  const index = _parseInteger(marshal)
  return marshal._symbols[ index ]
}

const _parseObjectLink = (marshal) => {
  const index = _parseInteger(marshal)
  return marshal._objects[ index ]
}

const _parseString = (marshal) => {
  const length = _parseInteger(marshal)
  return _parseBuffer(marshal, length).toString()
}

const _parseIvar = (marshal) => {
  const string = _parse(marshal)
  const lengthOfSymbolChar = _parseInteger(marshal)
  if (lengthOfSymbolChar !== 1) throw new MarshalError('invalid IVAR, expected a single character', marshal)

  // one character coming up, hopefully a symbol, treat it as a typecode
  const symbol = _parse(marshal)
  const value = _parse(marshal)
  marshal._objects.push(value) // values are saved in the object cache before the ivar

  let encoding
  if (symbol === 'E') { // 'E' means we have a common encoding, the following boolean determines UTF-8 or ASCII
    if (value === true) encoding = 'utf8'
    else encoding = 'ascii'
  } else if (symbol === 'encoding') { // 'encoding' means we have some other encoding
    if (value === 'ISO-8859-1') encoding = 'binary'
    else encoding = value
  } else throw new MarshalError(`invalid IVAR encoding specification ${symbol}`, marshal)

  const ivar = new Ivar(string, encoding)
  marshal._objects.push(ivar) // completed ivars are saved in the object cache
  debug('ivar %s', ivar)
  return ivar.toString()
}

class Marshal {
  constructor (buffer, encoding) {
    buffer !== undefined && this.load(buffer, encoding)
  }

  load (buffer, encoding) {
    if (buffer === undefined || buffer.length === 0) throw new MarshalError('no buffer specified', this)

    this.buffer = (buffer instanceof Buffer)
      ? buffer
      : Buffer.from(buffer, encoding)
    debug('buffer length %d', this.buffer.length)

    // reset the index
    this._index = 0

    // parse Marshal version
    this._version = `${_parseUInt8(this)}.${_parseUInt8(this)}`

    // create cache tables
    this._symbols = []
    this._objects = []

    if (this._index < this.buffer.length) {
      this.parsed = _parse(this)
    }

    return this
  }

  // dump () {
  //   //TODO
  // };

  toString (encoding) {
    return this.buffer.toString(encoding || 'base64')
  }

  toJSON () {
    return this.parsed
  }
}

module.exports = Marshal
