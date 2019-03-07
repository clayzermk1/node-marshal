class Ivar {
  constructor (rawString, encoding) {
    this.buffer = Buffer.from(rawString)
    this.encoding = encoding || 'utf8'

    // this.string = this.buffer.toString('utf8') // TODO: NOTE: seems this is not used later
  }

  toString () {
    return this.buffer.toString(this.encoding)
  }
}

Ivar.prototype.toJSON = Ivar.prototype.toString

module.exports = Ivar
