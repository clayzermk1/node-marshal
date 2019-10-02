# 0.5.2
- Updated changelog for 0.5.0-0.5.1.

# 0.5.1
- Updated `rails-cookie-parser` link in the readme to reflect repo ownership transfer.

# 0.5.0
- Upgraded dependencies to resolve security vulnerabilities.
- To ensure proper package operation, the node engine version has been updated to the latest LTS release (10.16.3). Please note that while Travis still builds against node versions all the way back to node v6 for the time being, I cannot support this package for any node version other than LTS.

# 0.4.0
- Replaced `new Buffer` with `Buffer.from` (#12). `new Buffer` has been [deprecated since Node.js v6.0.0](https://nodejs.org/dist/v10.15.0/docs/api/buffer.html#buffer_new_buffer_array). Thank you @ThatBean!
- Upgraded dependencies.

# 0.3.1
- Fixed package.json node engine version to permit newer versions of node for `yarn` users (https://github.com/clayzermk1/node-marshal/commit/4f89c88d6e91bcad54f1e008ce2cf108c18f3598#commitcomment-29083094). Thank you @xzyfer!
- Added node versions 7, 9, and 10 to Travis.

# 0.3.0
- Added support for floats (#8). Thank you @tgriesser!
- Added support for ISO-8859-1 encoded strings (#8, parsed as "binary"). Thank you @tgriesser!
- Updated dependencies.
- Removed Code Climate.
- Added test coverage with Codecov.
- Updated license copyright years.

# 0.2.3
- Fixed readme badge URLs (#7).

# 0.2.2 (successor to 0.2.0)
- Fixed object name parsing (#6).
- Updated repo URLs to new repo.

# 0.2.1 (DO NOT USE)
- Attempted bignum refactor (#5).

# 0.2.0
- Added bignum parsing (#4).
- Switched testing frameworks from `tap` to `tape`.
- Updated max supported node.js version to 6.3.1.
  - Added `travis` testing for node.js 6.3.x.
