# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.4](https://github.com/clayzermk1/node-marshal/compare/v0.5.3...v0.5.4) (2022-04-11)

## [0.5.3](https://github.com/clayzermk1/node-marshal/compare/v0.5.2...v0.5.3) (2022-01-26)


### CI

* replaced Travis-CI with GH Actions ([b3b218e](https://github.com/clayzermk1/node-marshal/commit/b3b218edaeb6145d0d195db46bff6e93d3f47646))


### Documentation

* added an example for using a Buffer (:tophat: [@steven89](https://github.com/steven89)) ([2e84ac1](https://github.com/clayzermk1/node-marshal/commit/2e84ac11888b47a987f8b8066f7e72a6d3238b08))
* clarified supported type comments for bignums and IVARs ([0ac3bca](https://github.com/clayzermk1/node-marshal/commit/0ac3bca22da4ba3941cb7037624d7af86a7be7bf))
* improved changelog formatting ([ed5de05](https://github.com/clayzermk1/node-marshal/commit/ed5de05700e5a04e98d08cdd2ddbf02bb052dc99))


### Build System

* added `standard-version` ([6da10c8](https://github.com/clayzermk1/node-marshal/commit/6da10c89cd4ba48a80dd67a1aef88a4b87bc6026))
* improved "ignore" file extension matching in gitignore ([c28ba3e](https://github.com/clayzermk1/node-marshal/commit/c28ba3ef909010706f2842bbd58f45038ba51db1))
* removed codecov dependency ([bff5cf9](https://github.com/clayzermk1/node-marshal/commit/bff5cf94e81b6902c73bbbf504f7d5e7d954fba8))
* upgraded dependencies and rebuilt package-lock.json ([656a075](https://github.com/clayzermk1/node-marshal/commit/656a075613a04836701f394f297facab250cda90))
* upgraded minimum node engine version to v12.22.9 ([a188d2d](https://github.com/clayzermk1/node-marshal/commit/a188d2d6e1d41ccbaa32094320abe6305aa54e1c))

## [0.5.2](https://github.com/clayzermk1/node-marshal/compare/v0.5.1...v0.5.2) (2019-10-02)
- Updated changelog for 0.5.0-0.5.1

## [0.5.1](https://github.com/clayzermk1/node-marshal/compare/v0.5.0...v0.5.1) (2019-10-02)
- Updated `rails-cookie-parser` link in the readme to reflect repo ownership transfer

## [0.5.0](https://github.com/clayzermk1/node-marshal/compare/0.4.0...v0.5.0) (2019-10-02)
- Upgraded dependencies to resolve security vulnerabilities
- To ensure proper package operation, the node engine version has been updated to the latest LTS release (10.16.3). Please note that while Travis still builds against node versions all the way back to node v6 for the time being, I cannot support this package for any node version other than LTS.

## [0.4.0](https://github.com/clayzermk1/node-marshal/compare/0.3.1...0.4.0) (2019-03-18)
- Replaced `new Buffer` with `Buffer.from` (#12). `new Buffer` has been [deprecated since Node.js v6.0.0](https://nodejs.org/dist/v10.15.0/docs/api/buffer.html#buffer_new_buffer_array). Thank you @ThatBean!
- Upgraded dependencies

## [0.3.1](https://github.com/clayzermk1/node-marshal/compare/0.3.0...0.3.1) (2018-05-22)
- Fixed package.json node engine version to permit newer versions of node for `yarn` users (https://github.com/clayzermk1/node-marshal/commit/4f89c88d6e91bcad54f1e008ce2cf108c18f3598#commitcomment-29083094). Thank you @xzyfer!
- Added node versions 7, 9, and 10 to Travis

## [0.3.0](https://github.com/clayzermk1/node-marshal/compare/0.2.3...0.3.0) (2018-05-18)
- Added support for floats (#8). Thank you @tgriesser!
- Added support for ISO-8859-1 encoded strings (#8, parsed as "binary"). Thank you @tgriesser!
- Updated dependencies
- Removed Code Climate
- Added test coverage with Codecov
- Updated license copyright years

## [0.2.3](https://github.com/clayzermk1/node-marshal/compare/0.2.2...0.2.3) (2017-11-03)
- Fixed readme badge URLs (#7)

## [0.2.2](https://github.com/clayzermk1/node-marshal/compare/0.2.0...0.2.2) (2017-11-02)
- Fixed object name parsing (#6)
- Updated repo URLs to new repo

## [0.2.1](https://github.com/clayzermk1/node-marshal/compare/0.2.0...0.2.1) DO NOT USE! (2016-08-25)
- Attempted bignum refactor (#5)

## [0.2.0](https://github.com/clayzermk1/node-marshal/compare/0.1.2...0.2.0) (2016-08-25)
- Added bignum parsing (#4)
- Switched testing frameworks from `tap` to `tape`
- Updated max supported node.js version to 6.3.1
- Added `travis` testing for node.js 6.3.x

## [0.1.2](https://github.com/clayzermk1/node-marshal/compare/0.1.1...0.1.2) (2015-07-01)
- Fixed parsing of negative one byte numbers (#2)
- Refactored incrementor
- Refactored negative two and three byte numbers
- Refactored tests for `node-tap` API changes
- Added test for negative one byte integers (#2)
- Added test for -150
- Upgraded dependencies

## [0.1.1](https://github.com/clayzermk1/node-marshal/compare/0.1.0...0.1.1) (2015-02-06)
- Removed inconsistent dump() function
- Minor changes to README and package.json

## [0.1.0](https://github.com/clayzermk1/node-marshal/compare/0.0.0...0.1.0) (2014-12-02)
- Added support for Ruby Objects
- Fixed a bug with three-byte numbers
- Fixed a bug with IVAR JSON serialization
- Updated library dependencies

## [0.0.0](https://github.com/clayzermk1/node-marshal/tree/0.0.0) (2014-11-06)
- Initial release
