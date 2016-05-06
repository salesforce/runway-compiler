/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let Statement = require('./statement.js');
let makeStatement = require('./factory.js');

class Sequence extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    this.statements = this.parsed.statements.map((s) => makeStatement.make(s, this.env));
  }

  execute(context) {
    this.statements.forEach((s) => s.execute(context));
  }

  typecheck() {
    this.statements.forEach((s) => s.typecheck());
  }

  toString(indent) {
    if (indent === undefined) {
      indent = '';
    }
    return this.statements.map((s) => s.toString(indent)).join('\n');
  }
}

module.exports = Sequence;
