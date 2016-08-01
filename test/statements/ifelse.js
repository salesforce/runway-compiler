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

describe('statements/ifelse.js', function() {
  describe('ifelse', function() {

    it('if-else False', function() {
      let module = testing.run(`
        var x : 0..2;
        if False {
          x = 1;
        } else {
          x = 2;
        }
      `);
      assert.equal(module.env.getVar('x').toString(), '2');
    });

    it('if-else True', function() {
      let module = testing.run(`
        var x : 0..2;
        if True {
          x = 1;
        } else {
          x = 2;
        }
      `);
      assert.equal(module.env.getVar('x').toString(), '1');
    });

    it('if-else expression', function() {
      let module = testing.run(`
        var x : 0..2;
        if True == True {
          x = 1;
        } else {
          x = 2;
        }
      `);
      assert.equal(module.env.getVar('x').toString(), '1');
    });

    it('if-only False', function() {
      let module = testing.run(`
        var x : 0..2;
        if False {
          x = 1;
        }
      `);
      assert.equal(module.env.getVar('x').toString(), '0');
    });

    it('if-only True', function() {
      let module = testing.run(`
        var x : 0..2;
        if True {
          x = 1;
        }
      `);
      assert.equal(module.env.getVar('x').toString(), '1');
    });

    it('else-if True', function() {
      let module = testing.run(`
        var x : 0..3;
        if False {
          x = 1;
        } else if True {
          x = 2;
        } else {
          x = 3;
        }
      `);
      assert.equal(module.env.getVar('x').toString(), '2');
    });

    it('else-if False', function() {
      let module = testing.run(`
        var x : 0..3;
        if False {
          x = 1;
        } else if False {
          x = 2;
        } else {
          x = 3;
        }
      `);
      assert.equal(module.env.getVar('x').toString(), '3');
    });

    it('else-if expression', function() {
      let module = testing.run(`
        var x : 0..3;
        if False {
          x = 1;
        } else if True == True {
          x = 2;
        } else {
          x = 3;
        }
      `);
      assert.equal(module.env.getVar('x').toString(), '2');
    });
  });
});
