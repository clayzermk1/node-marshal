var debug = require('debug')('marshal');
var util = require('util');

var MarshalError;

MarshalError = (function () {
  function MarshalError (message, instance) {
    this.name = 'MarshalError';
    this.message = message +
      ' (index: ' + (instance._index - 1) +
      ', hex: ' + instance.buffer.toString('hex', instance._index - 1, instance._index) +
      ', utf8: ' + instance.buffer.toString('utf8', instance._index - 1, instance._index) + ')';
    debug('buffer hex: ' +
        instance.buffer.toString('hex', 0, instance._index - 1) + ' ' +
        instance.buffer.toString('hex', instance._index - 1, instance._index) + ' ' +
        instance.buffer.toString('hex', instance._index));
    debug('buffer string: ' +
        instance.buffer.toString('utf8', 0, instance._index - 1) + ' ' +
        instance.buffer.toString('utf8', instance._index - 1, instance._index) + ' ' +
        instance.buffer.toString('utf8', instance._index));
    Error.captureStackTrace(this, this.constructor);
  };

  util.inherits(MarshalError, Error);

  return MarshalError;
})();

module.exports = MarshalError;
