var Ivar;

Ivar = (function () {
  function Ivar(rawString, encoding) {
    this.buffer = Buffer.from(rawString);
    this.encoding = encoding;
    this.string = this.buffer.toString('utf8');

    return this;
  };

  Ivar.prototype.toString = function () {
    return this.buffer.toString(this.encoding || 'utf8');
  };

  Ivar.prototype.toJSON = function () {
    return this.toString();
  };

  return Ivar;
})();

module.exports = Ivar;
