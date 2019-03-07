const test = require('tape')
const Marshal = require('../index.js')

// NOTE: Marshal.dump(<const>).unpack('H*') is invaluable for creating these buffer strings in hex
const version = Buffer.from('0408', 'hex')
const nily = Buffer.from('040830', 'hex')
const truey = Buffer.from('040854', 'hex')
const falsey = Buffer.from('040846', 'hex')
const intyZero = Buffer.from('04086900', 'hex')
const intyOne = Buffer.from('04086906', 'hex')
const intyOneTwoThree = Buffer.from('040869017b', 'hex')
const intyOneFiveZero = Buffer.from('0408690196', 'hex')
const intyTwoFiveSix = Buffer.from('040869020001', 'hex')
const intySixFiveFiveThreeSix = Buffer.from('04086903000001', 'hex')
const intyTwoPowerThirtyMinusOne = Buffer.from('04086904ffffff3f', 'hex')
const intyNegOne = Buffer.from('040869fa', 'hex')
const intyNegOneTwoFour = Buffer.from('040869ff84', 'hex')
const intyNegOneTwoNine = Buffer.from('040869ff7f', 'hex')
const intyNegOneFiveZero = Buffer.from('040869ff6a', 'hex')
const intyNegTwoFiveSeven = Buffer.from('040869fefffe', 'hex')
const intyNegTwoFiveSix = Buffer.from('040869ff00', 'hex')
const intyNegSixFiveFiveThreeSeven = Buffer.from('040869fdfffffe', 'hex')
const intyNegTwoPowerThirty = Buffer.from('040869fc000000c0', 'hex')
const bigIntyTwoPowerThirty = Buffer.from('04086c2b0700000040', 'hex') // Ruby smallest positive bignum
const bigIntyTwoPowerFiftyThreeMinusOne = Buffer.from('04086c2b09ffffffffffff1f00', 'hex') // JS Number max safe integer
const bigIntyNegTwoPowerThirtyMinusOne = Buffer.from('04086c2d0701000040', 'hex') // Ruby smallest negative bignum
const bigIntyNegTwoPowerFiftyThreeMinusOne = Buffer.from('04086c2d09ffffffffffff1f00', 'hex') // JS Number min safe integer
const symbolyHello = Buffer.from('04083a0a68656c6c6f', 'hex')
const symbolLinkyHello = Buffer.from('04085b073a0a68656c6c6f3b00', 'hex')
const objectLinkyHello = Buffer.from('04085b0749220a68656c6c6f063a0645544006', 'hex')
const objectNameIsLink = Buffer.from('04085b085b263a0773313a0773323a0773333a0773343a0773353a0773363a0773373a0773383a0773393a087331303a087331313a087331323a087331333a087331343a087331353a087331363a087331373a087331383a087331393a087332303a087332313a087332323a087332333a087332343a087332353a087332363a087332373a087332383a087332393a087333303a087333313a087333323a087333336f3a0642006f3b2600', 'hex') // #6
const stringyEmpty = Buffer.from('04082200', 'hex')
const stringyHello = Buffer.from('0408220a68656c6c6f', 'hex')
const ivaryHelloUtf = Buffer.from('040849220a68656c6c6f063a064554', 'hex')
const ivaryHelloAscii = Buffer.from('040849220a68656c6c6f063a064546', 'hex')
const ivaryHelloIso8859Dash1 = Buffer.from('040849220a68656c6c6f063a0d656e636f64696e67220f49534f2d383835392d31', 'hex')
const ivaryLorem = Buffer.from('04082201f64c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e7365637465747572206164697069736963696e6720656c69742e20526570656c6c617420766f6c757074617320726572756d20656f7320656c6967656e64692c20647563696d7573206c61626f72756d206578706c696361626f2074656d706f72696275732076656c206970736120657865726369746174696f6e656d2070726f766964656e74206f62636165636174692065756d206c61626f72652065787065646974612061747175652c20646f6c6f72656d717565206c61626f72696f73616d206e6973692c20726570726568656e64657269742e063a064554', 'hex')
const arrayyEmpty = Buffer.from('04085b00', 'hex')
const arrayyInteger = Buffer.from('04085b066906', 'hex')
const objectyEmpty = Buffer.from('04086f3a0b4f626a65637400', 'hex')
const objectyFoo = Buffer.from('04086f3a0b4f626a656374063a0940666f6f492208626172063a064554', 'hex')
const hashyEmpty = Buffer.from('04087b00', 'hex')
const hashyOneTwo = Buffer.from('04087b0669066907', 'hex')
const railsSessionCookie = Buffer.from('04087b0b49220f73657373696f6e5f6964063a0645544922253836663666666139323537363739653231633733306236376138626263363233063b00544922105f637372665f746f6b656e063b004649223175557364487970586e6576346a6a4932646f554271317049795270637a5959536c443968354c78445a51553d063b004649220c757365725f6964063b004649220196636f6e6e6563742e736573733d732533416a2533412537422532327573657225323225334125323230313631626663652d616665302d346239652d386265382d6530323637653263646465322532322537442e4c4664327a652532465973316750744979456f597257665861747464633144774a353469576c332532462532426a6b35553b20506174683d2f3b20487474704f6e6c79063b005449221270617373776f72645f68617368063b00464922253334666263633762663264306265613335356164373938653032383938663563063b00464922106c6f636174696f6e5f6964063b004649222932356239306561632d303736392d343864382d393866612d383861343863633830376138063b005449220f6163636f756e745f6964063b004649222939363661656139662d636266302d346137392d383061642d623131633966393565626130063b0054', 'hex')
const floatyPositive = Buffer.from('0408660c31322e33343536', 'hex')
const floatyNegative = Buffer.from('0408660d2d31322e33343536', 'hex')
const floatyPositiveInfinity = Buffer.from('04086608696e66', 'hex')
const floatyNegativeInfinity = Buffer.from('040866092d696e66', 'hex')
const floatyNaN = Buffer.from('040866086e616e', 'hex')

test('marshal', (t) => {
  t.test('parse', (t) => {
    const m = new Marshal()
    t.test('version', (t) => {
      t.equal(m.load(version)._version, '4.8', 'should equal 4.8')
      t.end()
    })

    t.test('nil', (t) => {
      t.equal(m.load(nily).parsed, null, 'should equal null')
      t.end()
    })

    t.test('booleans', (t) => {
      t.test('true', (t) => {
        t.equal(m.load(truey).parsed, true, 'should equal true')
        t.end()
      })
      t.test('false', (t) => {
        t.equal(m.load(falsey).parsed, false, 'should equal false')
        t.end()
      })
      t.end()
    })

    t.test('integers', (t) => {
      t.test('0', (t) => {
        t.equal(m.load(intyZero).parsed, 0, 'should equal 0')
        t.end()
      })
      t.test('1', (t) => {
        t.equal(m.load(intyOne).parsed, 1, 'should equal 1')
        t.end()
      })
      t.test('123', (t) => {
        t.equal(m.load(intyOneTwoThree).parsed, 123, 'should equal 123')
        t.end()
      })
      t.test('150', (t) => {
        t.equal(m.load(intyOneFiveZero).parsed, 150, 'should equal 150')
        t.end()
      })
      t.test('256', (t) => {
        t.equal(m.load(intyTwoFiveSix).parsed, 256, 'should equal 256')
        t.end()
      })
      t.test('65536', (t) => {
        t.equal(m.load(intySixFiveFiveThreeSix).parsed, 65536, 'should equal 65536')
        t.end()
      })
      t.test('2^30 - 1', (t) => {
        t.equal(m.load(intyTwoPowerThirtyMinusOne).parsed, Math.pow(2, 30) - 1, 'should equal 2^30 - 1')
        t.end()
      })
      t.test('-1', (t) => {
        t.equal(m.load(intyNegOne).parsed, -1, 'should equal -1')
        t.end()
      })
      t.test('-124', (t) => {
        t.equal(m.load(intyNegOneTwoFour).parsed, -124, 'should equal -124')
        t.end()
      })
      t.test('-129', (t) => {
        t.equals(m.load(intyNegOneTwoNine).parsed, -129, 'should equal -129')
        t.end()
      })
      t.test('-150', (t) => {
        t.equals(m.load(intyNegOneFiveZero).parsed, -150, 'should equal -150')
        t.end()
      })
      t.test('-256', (t) => {
        t.equals(m.load(intyNegTwoFiveSix).parsed, -256, 'should equal -256')
        t.end()
      })
      t.test('-257', (t) => {
        t.equal(m.load(intyNegTwoFiveSeven).parsed, -257, 'should equal -257')
        t.end()
      })
      t.test('-65537', (t) => {
        t.equal(m.load(intyNegSixFiveFiveThreeSeven).parsed, -65537, 'should equal -65537')
        t.end()
      })
      t.test('-2^30', (t) => {
        t.equal(m.load(intyNegTwoPowerThirty).parsed, -Math.pow(2, 30), 'should equal -2^30')
        t.end()
      })
      t.end()
    })

    t.test('bignums', (t) => {
      t.test('2^30', (t) => {
        t.equal(m.load(bigIntyTwoPowerThirty).parsed, '1073741824', 'should equal "1073741824"')
        t.end()
      })
      t.test('2^53 - 1', (t) => {
        t.equal(m.load(bigIntyTwoPowerFiftyThreeMinusOne).parsed, '9007199254740991', 'should equal "9007199254740991"')
        t.end()
      })
      t.test('-2^30 - 1', (t) => {
        t.equal(m.load(bigIntyNegTwoPowerThirtyMinusOne).parsed, '-1073741825', 'should equal "-1073741825"')
        t.end()
      })
      t.test('-2^53 - 1', (t) => {
        t.equal(m.load(bigIntyNegTwoPowerFiftyThreeMinusOne).parsed, '-9007199254740991', 'should equal "-9007199254740991"')
        t.end()
      })
    })

    t.test('strings', (t) => {
      t.test('<empty>', (t) => {
        t.equal(m.load(stringyEmpty).parsed, '', 'should equal ""')
        t.end()
      })
      t.test('hello', (t) => {
        t.equal(m.load(stringyHello).parsed, 'hello', 'should equal "hello"')
        t.end()
      })
      t.end()
    })

    t.test('symbols', (t) => {
      t.test(':hello', (t) => {
        t.equal(m.load(symbolyHello).parsed, 'hello', 'should equal "hello"')
        t.end()
      })
      t.end()
    })

    t.test('symbol links', (t) => {
      t.test(';0', (t) => {
        t.equal(m.load(symbolLinkyHello).parsed[ 1 ], 'hello', 'should equal "hello"')
        t.end()
      })
      t.end()
    })

    t.test('object links', (t) => {
      t.test('@0', (t) => {
        t.equal('' + m.load(objectLinkyHello).parsed[ 1 ], 'hello', 'should equal "hello"')
        t.end()
      })
      t.end()
    })

    t.test('ivars', (t) => {
      t.test('hello (utf8)', (t) => {
        t.equal('' + m.load(ivaryHelloUtf).parsed, 'hello', 'should equal "hello"')
        t.end()
      })
      t.test('hello (ascii)', (t) => {
        t.equal('' + m.load(ivaryHelloAscii).parsed, 'hello', 'should equal "hello"')
        t.end()
      })
      t.test('hello (ISO-8859-1)', (t) => {
        t.equal('' + m.load(ivaryHelloIso8859Dash1).parsed, 'hello', 'should equal "hello"')
        t.end()
      })
      t.test('lorem', (t) => {
        t.equal(
          '' + m.load(ivaryLorem).parsed,
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat voluptas rerum eos eligendi, ducimus laborum explicabo temporibus vel ipsa exercitationem provident obcaecati eum labore expedita atque, doloremque laboriosam nisi, reprehenderit.',
          'should be "Lorem ipsum ..."'
        )
        t.end()
      })
      t.end()
    })

    t.test('arrays', (t) => {
      t.test('[]', (t) => {
        const array = m.load(arrayyEmpty).parsed
        t.ok(array instanceof Array, 'should be an array instance')
        t.equal(array.length, 0, 'should be empty')
        t.end()
      })
      t.test('[1]', (t) => {
        const array = m.load(arrayyInteger).parsed
        t.ok(array instanceof Array, 'should be an array instance')
        t.equal(array.length, 1, 'should have one member')
        t.end()
      })
      t.end()
    })

    t.test('objects', (t) => {
      t.test('empty', (t) => {
        t.deepEqual(m.load(objectyEmpty).parsed, { _name: 'Object' }, "should equal { _name: 'Object' }")
        t.end()
      })
      t.test("single instance variable '@foo'", (t) => {
        t.deepEqual(m.load(objectyFoo).parsed, { _name: 'Object', '@foo': 'bar' }, "should equal { _name: 'Object', '@foo': 'bar' }")
        t.end()
      })
      t.test('name is link', (t) => {
        t.deepEqual(m.load(objectNameIsLink).parsed, [
          [ 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15', 's16', 's17', 's18', 's19', 's20', 's21', 's22', 's23', 's24', 's25', 's26', 's27', 's28', 's29', 's30', 's31', 's32', 's33' ],
          { _name: 'B' },
          { _name: 'B' }
        ], 'should equal the test object with a name that is a symbol link and a high link index (see #6)')
        t.end()
      })
      t.end()
    })

    t.test('hashes', (t) => {
      t.test('{}', (t) => {
        t.deepEqual(m.load(hashyEmpty).parsed, {}, 'should equal {}')
        t.end()
      })
      t.test('{ 1: 2 }', (t) => {
        t.deepEqual(m.load(hashyOneTwo).parsed, { 1: 2 }, 'should equal { 1: 2 }')
        t.end()
      })
      t.end()
    })

    t.test('floats', (t) => {
      t.test('positive float', (t) => {
        t.equal(m.load(floatyPositive).parsed, 12.3456, 'should equal 12.3456')
        t.end()
      })
      t.test('negative float', (t) => {
        t.equal(m.load(floatyNegative).parsed, -12.3456, 'should equal -12.3456')
        t.end()
      })
      t.test('positive infinity', (t) => {
        t.equal(m.load(floatyPositiveInfinity).parsed, Infinity, 'should equal Infinity')
        t.end()
      })
      t.test('negative infinity', (t) => {
        t.equal(m.load(floatyNegativeInfinity).parsed, -Infinity, 'should equal -Infinity')
        t.end()
      })
      t.test('NaN', (t) => {
        t.equal(Number.isNaN(m.load(floatyNaN).parsed), true, 'should equal NaN')
        t.end()
      })
      t.end()
    })

    t.end()
  })
  t.end()
})
