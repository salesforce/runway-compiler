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

describe('statements/return.js', function() {
  describe('return', function() {

    it('returns copy, not ref', function() {
      let module = testing.run(`
        type Box : record {
          bool: Boolean,
        };
        var bools : Array<Box>[1..2];
        function getFirst() -> Box {
          for box in bools {
            return box;
          }
        }
        var mbox : Box = getFirst();
        mbox.bool = True;
      `);
      assert.equal(module.env.getVar('bools').toString(),
        '[1: Box { bool: False }, 2: Box { bool: False }]');
      assert.equal(module.env.getVar('mbox').toString(),
        'Box { bool: True }');
    });
  });
});
