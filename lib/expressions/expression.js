/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let errors = require('../errors.js');

class Expression {
  constructor(parsed, env) {
    this.parsed = parsed;
    this.env = env;
  }

  typecheck() {
    throw new errors.Unimplemented(`typecheck() not implemented for ${this.parsed.kind} expression`);
  }

  evaluate() {
    throw new errors.Unimplemented(`evaluate() not implemented for ${this.parsed.kind} expression`);
  }

  toString(indent) {
    throw new errors.Unimplemented(`${this.parsed.kind} is missing toString()`);
  }
}

module.exports = Expression;
