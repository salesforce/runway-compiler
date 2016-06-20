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

describe('types/varlen.js', function() {
  describe('Set', function() {
    it('basic', function() {
      let module = testing.run(`
        type Stuff : 0..99;
        var set : Set<Stuff>[1..5];
        push(set, 33);
        push(set, 37);
        push(set, 33);
        var b1 : Boolean = contains(set, 33);
        pop(set);
        var b2 : Boolean = empty(set);
      `);
      assert.equal(module.env.getVar('set').toString(),
        '{1: 33}');
      assert.equal(module.env.getVar('b1').toString(),
        'True');
      assert.equal(module.env.getVar('b2').toString(),
        'False');
    });
  });

  describe('OrderedSet', function() {
    it('basic', function() {
      let module = testing.run(`
        type Stuff : 0..99;
        var set : OrderedSet<Stuff>[1..5];
        push(set, 33);
        push(set, 37);
        var b1 : Boolean = contains(set, 33);
        pop(set);
        var b2 : Boolean = empty(set);
      `);
      assert.equal(module.env.getVar('set').toString(),
        '{1: 33}');
      assert.equal(module.env.getVar('b1').toString(),
        'True');
      assert.equal(module.env.getVar('b2').toString(),
        'False');
    });

    it('pop (issue-5 regression)', function() {
      let module = testing.run(`
        type Number : 0..9;
        var os : OrderedSet<Number>[1..3];
        push(os, 2);
        push(os, 4);
        var e1 : Number = pop(os);
        var e2 : Number = pop(os);
      `);
      assert.equal(module.env.getVar('os').toString(),
        '{}');
      assert.equal(module.env.getVar('e1').toString(),
        '4');
      assert.equal(module.env.getVar('e2').toString(),
        '2');
    });
  });

  describe('MultiSet', function() {
    it('basic', function() {
      let module = testing.run(`
        type Stuff : 0..99;
        var set : MultiSet<Stuff>[1..5];
        push(set, 33);
        push(set, 37);
        push(set, 33);
        var b1 : Boolean = contains(set, 33);
        pop(set);
        var b2 : Boolean = empty(set);
      `);
      assert.equal(module.env.getVar('set').toString(),
        '{1: 33, 2: 33}');
      assert.equal(module.env.getVar('b1').toString(),
        'True');
      assert.equal(module.env.getVar('b2').toString(),
        'False');
    });
  });

  describe('Vector', function() {
    it('basic', function() {
      let module = testing.run(`
        type Stuff : 0..99;
        var set : Vector<Stuff>[1..5];
        push(set, 33);
        push(set, 37);
        push(set, 33);
        var b1 : Boolean = contains(set, 33);
        pop(set);
        var b2 : Boolean = empty(set);
      `);
      assert.equal(module.env.getVar('set').toString(),
        '{1: 33, 2: 37}');
      assert.equal(module.env.getVar('b1').toString(),
        'True');
      assert.equal(module.env.getVar('b2').toString(),
        'False');
    });
  });
});
