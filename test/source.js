/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let assert = require('assert');
let Input = require('../lib/input.js');
let Source = require('../lib/source.js');

let alphabet = `abc
def
ghi
jkl
mno
pqr
stu
vwx
yz
`;

describe('source.js', function() {
  describe('Source', function() {
    it('basic', function() {
      let source = new Source(
        {offset: 10, line: 3, column: 3},
        {offset: 20, line: 6, column: 1});
      assert.equal(source.toString(), 'chars 10-20');
      source.setInput(new Input('foo.txt', alphabet));
      assert.equal(source.toString(), 'foo.txt: line 3, col 3 to line 6, col 1');
    });
  });
});
