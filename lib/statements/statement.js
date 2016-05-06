/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let errors = require('../errors.js');

class Statement {
  constructor(parsed, env) {
    this.parsed = parsed;
    this.env = env;
  }

  typecheck() {
    throw new errors.Internal(`typecheck() not implemented for ${this.parsed.kind} statement`);
  }

  execute() {
    throw new errors.Internal(`execute() not implemented for ${this.parsed.kind} statement`);
  }

  toString(indent) {
    return `${indent}${this.parsed.kind} is missing toString();`;
  }
}

module.exports = Statement;
