var test = require('tap').test;
var Marshal = require('../index.js');

// NOTE: Marshal.dump(<var>).unpack('H*') is invaluable for creating these buffer strings in hex
var version = new Buffer('0408', 'hex');
var nily = new Buffer('040830', 'hex');
var truey = new Buffer('040854', 'hex');
var falsey = new Buffer('040846', 'hex');
var intyZero = new Buffer('04086900', 'hex');
var intyOne = new Buffer('04086906', 'hex');
var intyOneTwoThree = new Buffer('040869017b', 'hex');
var intyOneFiveZero = new Buffer('0408690196', 'hex');
var intyTwoFiveSix = new Buffer('040869020001', 'hex');
var intySixFiveFiveThreeSix = new Buffer('04086903000001', 'hex');
var intyTwoPowerThirtyMinusOne = new Buffer('04086904ffffff3f', 'hex');
var intyNegOne = new Buffer('040869fa', 'hex');
var intyNegOneTwoFour = new Buffer('040869ff84', 'hex');
var intyNegOneTwoNine = new Buffer('040869ff7f', 'hex');
var intyNegOneFiveZero = new Buffer('040869ff6a', 'hex');
var intyNegTwoFiveSeven = new Buffer('040869fefffe', 'hex');
var intyNegTwoFiveSix = new Buffer('040869ff00', 'hex');
var intyNegSixFiveFiveThreeSeven = new Buffer('040869fdfffffe', 'hex');
var intyNegTwoPowerThirty = new Buffer('040869fc000000c0', 'hex');
var symbolyHello = new Buffer('04083a0a68656c6c6f', 'hex');
var symbolLinkyHello = new Buffer('04085b073a0a68656c6c6f3b00', 'hex');
var objectLinkyHello = new Buffer('04085b0749220a68656c6c6f063a0645544006', 'hex');
var stringyEmpty = new Buffer('04082200', 'hex');
var stringyHello = new Buffer('0408220a68656c6c6f', 'hex');
var ivaryHelloUtf = new Buffer('040849220a68656c6c6f063a064554', 'hex');
var ivaryHelloAscii = new Buffer('040849220a68656c6c6f063a064546', 'hex');
var ivaryLorem = new Buffer('04082201f64c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e7365637465747572206164697069736963696e6720656c69742e20526570656c6c617420766f6c757074617320726572756d20656f7320656c6967656e64692c20647563696d7573206c61626f72756d206578706c696361626f2074656d706f72696275732076656c206970736120657865726369746174696f6e656d2070726f766964656e74206f62636165636174692065756d206c61626f72652065787065646974612061747175652c20646f6c6f72656d717565206c61626f72696f73616d206e6973692c20726570726568656e64657269742e063a064554', 'hex');
var arrayyEmpty = new Buffer('04085b00', 'hex');
var arrayyInteger = new Buffer('04085b066906', 'hex');
var objectyEmpty = new Buffer('04086f3a0b4f626a65637400', 'hex');
var objectyFoo = new Buffer('04086f3a0b4f626a656374063a0940666f6f492208626172063a064554', 'hex');
var hashyEmpty = new Buffer('04087b00', 'hex');
var hashyOneTwo = new Buffer('04087b0669066907', 'hex');
var railsSessionCookie = new Buffer('04087b0b49220f73657373696f6e5f6964063a0645544922253836663666666139323537363739653231633733306236376138626263363233063b00544922105f637372665f746f6b656e063b004649223175557364487970586e6576346a6a4932646f554271317049795270637a5959536c443968354c78445a51553d063b004649220c757365725f6964063b004649220196636f6e6e6563742e736573733d732533416a2533412537422532327573657225323225334125323230313631626663652d616665302d346239652d386265382d6530323637653263646465322532322537442e4c4664327a652532465973316750744979456f597257665861747464633144774a353469576c332532462532426a6b35553b20506174683d2f3b20487474704f6e6c79063b005449221270617373776f72645f68617368063b00464922253334666263633762663264306265613335356164373938653032383938663563063b00464922106c6f636174696f6e5f6964063b004649222932356239306561632d303736392d343864382d393866612d383861343863633830376138063b005449220f6163636f756e745f6964063b004649222939363661656139662d636266302d346137392d383061642d623131633966393565626130063b0054', 'hex');

test('marshal', function (t) {
  t.test('parse', function (t) {
    var m = new Marshal();
    t.test('version', function (t) {
      t.equals(m.load(version)._version, '4.8', 'should equal 4.8');
      t.end();
    });
    t.test('nil', function (t) {
      t.deepEquals(m.load(nily).parsed, null, 'should equal null');
      t.end();
    });
    t.test('booleans', function (t) {
      t.test('true', function (t) {
        t.equals(m.load(truey).parsed, true, 'should equal true');
        t.end();
      });
      t.test('false', function (t) {
        t.equals(m.load(falsey).parsed, false, 'should equal false');
        t.end();
      });
    });
    t.test('integers', function (t) {
      t.test('0', function (t) {
        t.equals(m.load(intyZero).parsed, 0, 'should equal 0');
        t.end();
      });
      t.test('1', function (t) {
        t.equals(m.load(intyOne).parsed, 1, 'should equal 1');
        t.end();
      });
      t.test('123', function (t) {
        t.equals(m.load(intyOneTwoThree).parsed, 123, 'should equal 123');
        t.end();
      });
      t.test('150', function (t) {
        t.equals(m.load(intyOneFiveZero).parsed, 150, 'should equal 150');
        t.end();
      });
      t.test('256', function (t) {
        t.equals(m.load(intyTwoFiveSix).parsed, 256, 'should equal 256');
        t.end();
      });
      t.test('65536', function (t) {
        t.equals(m.load(intySixFiveFiveThreeSix).parsed, 65536, 'should equal 65536');
        t.end();
      });
      t.test('2^30 - 1', function (t) {
        t.equals(m.load(intyTwoPowerThirtyMinusOne).parsed, Math.pow(2, 30) - 1, 'should equal 2^30 - 1');
        t.end();
      });
      t.test('-1', function (t) {
        t.equals(m.load(intyNegOne).parsed, -1, 'should equal 1');
        t.end();
      });
      t.test('-124', function (t) {
        t.equals(m.load(intyNegOneTwoFour).parsed, -124, 'should equal -124');
        t.end();
      });
      t.test('-129', function (t) {
        t.equals(m.load(intyNegOneTwoNine).parsed, -129, 'should equal -129');
        t.end();
      });
      t.test('-150', function (t) {
        t.equals(m.load(intyNegOneFiveZero).parsed, -150, 'should equal -150');
        t.end();
      });
      t.test('-256', function (t) {
        t.equals(m.load(intyNegTwoFiveSix).parsed, -256, 'should equal -256');
        t.end();
      });
      t.test('-257', function (t) {
        t.equals(m.load(intyNegTwoFiveSeven).parsed, -257, 'should equal -257');
        t.end();
      });
      t.test('-65537', function (t) {
        t.equals(m.load(intyNegSixFiveFiveThreeSeven).parsed, -65537, 'should equal -65537');
        t.end();
      });
      t.test('-2^30', function (t) {
        t.equals(m.load(intyNegTwoPowerThirty).parsed, -Math.pow(2, 30), 'should equal -2^30');
        t.end();
      });
    });
    t.test('strings', function (t) {
      t.test('<empty>', function (t) {
        t.equals(m.load(stringyEmpty).parsed, '', 'should equal ""');
        t.end();
      });
      t.test('hello', function (t) {
        t.equals(m.load(stringyHello).parsed, 'hello', 'should equal "hello"');
        t.end();
      });
    });
    t.test('symbols', function (t) {
      t.test(':hello', function (t) {
        t.equals(m.load(symbolyHello).parsed, 'hello', 'should equal "hello"');
        t.end();
      });
    });
    t.test('symbol links', function (t) {
      t.test(';0', function (t) {
        t.equals(m.load(symbolLinkyHello).parsed[1], 'hello', 'should equal "hello"');
        t.end();
      });
    });
    t.test('object links', function (t) {
      t.test('@0', function (t) {
        t.equals('' + m.load(objectLinkyHello).parsed[1], 'hello', 'should equal "hello"');
        t.end();
      });
    });
    t.test('ivars', function (t) {
      t.test('hello (utf8)', function (t) {
        t.equals('' + m.load(ivaryHelloUtf).parsed, 'hello', 'should equal "hello"');
        t.end();
      });
      t.test('hello (ascii)', function (t) {
        t.equals('' + m.load(ivaryHelloAscii).parsed, 'hello', 'should equal "hello"');
        t.end();
      });
      t.test('lorem', function (t) {
        t.equals('' + m.load(ivaryLorem).parsed, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat voluptas rerum eos eligendi, ducimus laborum explicabo temporibus vel ipsa exercitationem provident obcaecati eum labore expedita atque, doloremque laboriosam nisi, reprehenderit.', 'should be "Lorem ipsum ..."');
        t.end();
      });
    });
    t.test('arrays', function (t) {
      t.test('[]', function (t) {
        t.deepEquals(m.load(arrayyEmpty).parsed, [], 'should equal []');
        t.end();
      });
      t.test('[1]', function (t) {
        t.deepEquals(m.load(arrayyInteger).parsed, [1], 'should equal [1]');
        t.end();
      });
    });
    t.test('objects', function (t) {
      t.test('empty', function (t) {
        t.deepEquals(m.load(objectyEmpty).parsed, { _name: 'Object' }, 'should equal { _name: \'Object\' }');
        t.end();
      });
      t.test('single instance variable \'@foo\'', function (t) {
        t.deepEquals(m.load(objectyFoo).parsed, { _name: 'Object', '@foo': 'bar' }, 'should equal { _name: \'Object\', \'@foo\': \'bar\' }');
        t.end();
      });
    });
    t.test('hashes', function (t) {
      t.test('{}', function (t) {
        t.deepEquals(m.load(hashyEmpty).parsed, {}, 'should equal {}');
        t.end();
      });
      t.test('{ 1: 2 }', function (t) {
        t.deepEquals(m.load(hashyOneTwo).parsed, { 1: 2 }, 'should equal { 1: 2 }');
        t.end();
      });
    });
  });
});
