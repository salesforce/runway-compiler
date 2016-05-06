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

describe('statements/rule.js', function() {
  let context = {};
  describe('rule', function() {
    it('basic', function() {
      let module = testing.run(`
        var bool : Boolean;
        rule setToTrue {
          bool = True;
        }
      `);
      assert.equal(module.env.getVar('bool').toString(), 'False');
      module.env.getRule('setToTrue').fire(context);
      assert.equal(module.env.getVar('bool').toString(), 'True');
    });

    it('variables reset to start', function() {
      let module = testing.run(`
        rule setToTrue {
          var bool : Boolean;
          assert !bool;
          bool = True;
        }
      `);
      module.env.getRule('setToTrue').fire(context);
      module.env.getRule('setToTrue').fire(context);
    });

    it('variables reset to start in nested environments', function() {
      let module = testing.run(`
        rule setToTrue {
          var done : Boolean = False;
          while !done {
            var bool : Boolean;
            assert !bool;
            bool = True;
            done = True;
          }
        }
      `);
      module.env.getRule('setToTrue').fire(context);
      module.env.getRule('setToTrue').fire(context);
    });
  });
});
