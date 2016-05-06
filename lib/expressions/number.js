/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let Expression = require('./expression.js');
let NumberType = require('../types/number.js').Type;

class NumberExpr extends Expression {
  constructor(parsed, env) {
    super(parsed, env);
    this.type = NumberType.singleton;
  }

  typecheck() {
    // no-op
  }

  evaluate() {
    let v = NumberType.singleton.makeDefaultValue();
    v.assign(this.parsed.value);
    return v;
  }

  toString(indent) {
    return `${this.parsed.value}`;
  }
}

module.exports = NumberExpr;
