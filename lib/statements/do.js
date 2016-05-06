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

class Do extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    this.expr = makeExpression.make(this.parsed.expr, this.env);
  }

  typecheck() {
    this.expr.typecheck();
    if (this.parsed.expr.kind != 'apply' ||
      this.expr.fn.pure !== false) {
      throw new errors.Type(`Statement has no effect ` +
        `at ${this.parsed.source}`);
    }
  }

  execute(context) {
    this.expr.evaluate(context);
  }
}

module.exports = Do;
