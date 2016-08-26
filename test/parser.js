/*
 * Copyright (c) 2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let assert = require('assert');
let testing = require('../lib/testing.js');

describe('parser.js', function() {
  describe('Parser', function() {
    it('whitespace', function() {
      assert.throws(() => testing.run(`
        ifTrue {
          print 1;
        }
      `));
    });
  });
});
