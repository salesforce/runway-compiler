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

describe('statements/while.js', function() {
  describe('while', function() {

    it('basic', function() {
      let module = testing.run(`
        var i : 0..99 = 30;
        var j : 0..99 = 0;
        while j < i {
          j = j + 1;
        }
      `);
      assert.equal(module.env.getVar('j').toString(), '30');
    });

    it('break', function() {
      let module = testing.run(`
        var i : 0..99 = 30;
        var j : 0..99 = 0;
        while True {
          if j == i {
            break;
          }
          j = j + 1;
        }
      `);
      assert.equal(module.env.getVar('j').toString(), '30');
    });

    it('continue', function() {
      let module = testing.run(`
        var i : 0..99 = 30;
        var j : 0..99 = 0;
        while True {
          if j >= i {
            break;
          }
          j = j + 1;
        }
      `);
      assert.equal(module.env.getVar('j').toString(), '30');
    });


  });
});
