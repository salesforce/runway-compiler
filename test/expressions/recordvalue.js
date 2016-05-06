/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let assert = require('assert');
let errors = require('../../lib/errors.js');
let testing = require('../../lib/testing.js');

describe('expressions/recordvalue.js', function() {
  describe('record value', function() {

    it('either', function() {
      let module = testing.run(`
        type Elevator: record {
            location: either {
                AtFloor {
                    at: 1..5,
                },
                Between {
                    next: 1..5,
                },
            },
        }
        var elevator : Elevator;
        elevator.location = AtFloor { at: 3 };
        var floor : 1..5;
        match elevator.location {
            AtFloor as a => { floor = a.at; },
            Between as b => { floor = b.next; },
        }
      `);
      assert.equal(module.env.getVar('floor').toString(), '3');
    });

    it('outside range', function() {
      assert.throws(() => testing.run(`
        type T: record {
            f: 1..5,
        }
        var t : T;
        t = T { f: 6 };
      `), errors.RangeError);
    });

  });
});
