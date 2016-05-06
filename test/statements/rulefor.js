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

describe('statements/rulefor.js', function() {
  let context = {};
  describe('rulefor', function() {
    it('basic', function() {
      let module = testing.run(`
        var bools : Array<Boolean>[1..3];
        bools[2] = True;
        rule invert for bool in bools {
          bool = (bool == False);
        }
      `);
      assert.equal(module.env.getVar('bools').toString(),
        '[1: False, 2: True, 3: False]');
      module.env.getRule('invert').fire(3, context);
      assert.equal(module.env.getVar('bools').toString(),
        '[1: False, 2: True, 3: True]');
    });

    it('with index', function() {
      let module = testing.run(`
        type Digit : 0..9;
        var ints : Array<Digit>[4..6];
        rule setToIndex for i, v in ints {
          v = i;
        }
      `);
      assert.equal(module.env.getVar('ints').toString(),
        '[4: 0, 5: 0, 6: 0]');
      module.env.getRule('setToIndex').fire(5, context);
      assert.equal(module.env.getVar('ints').toString(),
        '[4: 0, 5: 5, 6: 0]');
    });

    it('nested', function() {
      let module = testing.run(`
        var bools : Array<Boolean>[1..3];
        bools[2] = True;
        rule xor for bool1 in bools
                 for bool2 in bools {
          bool1 = (bool1 != bool2);
        }
      `);
      assert.equal(module.env.getVar('bools').toString(),
        '[1: False, 2: True, 3: False]');
      module.env.getRule('xor').fire([3, 2], context);
      module.env.getRule('xor').fire([2, 3], context);
      assert.equal(module.env.getVar('bools').toString(),
        '[1: False, 2: False, 3: True]');
    });

  });
});
