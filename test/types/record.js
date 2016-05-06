/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let assert = require('assert');
let testing = require('../../lib/testing.js');

describe('types/record.js', function() {
  describe('record', function() {
    it('basic', function() {
      let module = testing.run(`
        type DigitBox : record {
          digit: 0..9,
        }
        var a : DigitBox;
        var b : DigitBox = DigitBox { digit: 3 };
      `);
      assert.equal(module.env.getVar('a').toString(), 'DigitBox { digit: 0 }');
      assert.equal(module.env.getVar('b').toString(), 'DigitBox { digit: 3 }');
    });
  });
});
