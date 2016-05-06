/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let errors = require('../errors.js');
let makeExpression = require('../expressions/factory.js');
let Statement = require('./statement.js');
let Types = require('../types/types.js');

class Assign extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    this.lhs = makeExpression.make(this.parsed.lhs, this.env);
    this.rhs = makeExpression.make(this.parsed.rhs, this.env);
  }

  typecheck() {
    this.lhs.typecheck();
    this.rhs.typecheck();
    if (!Types.subtypeOf(this.rhs.type, this.lhs.type)) {
      throw new errors.Type(`Cannot assign ${this.rhs.type} to variable of ` +
        `type ${this.lhs.type} at ${this.parsed.source}`);
    }
  }

  execute(context) {
    this.lhs.evaluate(context).assign(this.rhs.evaluate(context));
  }

  toString(indent) {
    return `${indent}${this.lhs.toString(indent)} = ${this.rhs.toString(indent)};`;
  }
}

module.exports = Assign;
