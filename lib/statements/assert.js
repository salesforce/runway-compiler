/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let makeExpression = require('../expressions/factory.js');
let Statement = require('./statement.js');
let errors = require('../errors.js');
let Types = require('../types/types.js');

class Assert extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    this.expr = makeExpression.make(this.parsed.expr, this.env);
  }

  typecheck() {
    this.expr.typecheck();
    let boolType = this.env.getType('Boolean');
    if (!Types.subtypeOf(this.expr.type, boolType)) {
      throw new errors.Type(`Cannot assert ${this.expr.type}`);
    }
  }

  execute(context) {
    if (!this.expr.evaluate(context).equals(this.env.getVar('True'))) {
      let msg = `Assertion failed: ${this.expr} at ${this.parsed.source}`;
      throw new errors.Assertion(msg);
    }
  }
}

module.exports = Assert;
