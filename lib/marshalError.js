const { debug, IS_DEBUG } = require('./debug')

// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript

function MarshalError (message, instance) {
  const buffer = instance.buffer
  const index = instance._index - 1
  const indexTo = instance._index

  this.message = `${message} (index: ${index}, hex: ${buffer.toString('hex', index, indexTo)}, utf8: ${buffer.toString('utf8', index, indexTo)})`
  this.stack = Error().stack

  IS_DEBUG && debug('buffer hex: %s %s %s',
    buffer.toString('hex', 0, index),
    buffer.toString('hex', index, indexTo),
    buffer.toString('hex', indexTo)
  )
  IS_DEBUG && debug('buffer string: %s %s %s',
    buffer.toString('utf8', 0, index),
    buffer.toString('utf8', index, indexTo),
    buffer.toString('utf8', indexTo)
  )
}

MarshalError.prototype = Object.create(Error.prototype)
MarshalError.prototype.name = 'MarshalError'

module.exports = MarshalError
