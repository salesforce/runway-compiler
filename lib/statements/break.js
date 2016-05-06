/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let errors = require('../errors.js');
let Statement = require('./statement.js');

class Break extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
  }

  typecheck() {}

  execute() {
    throw new errors.Break(`Uncaught break at ${this.parsed.source}`);
  }
}

module.exports = Break;
