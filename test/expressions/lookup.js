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

describe('expressions/lookup.js', function() {
  describe('lookup', function() {

    it('basic', function() {
      let module = testing.run(`
        type T : record {
          inner: Boolean,
        }
        var t : T;
        var x : Boolean = True;
        x = t.inner;
      `);
      assert.equal(module.env.getVar('x').toString(), 'False');
    });

  });
});
