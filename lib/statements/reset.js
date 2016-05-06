/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let Statement = require('./statement.js');

class Reset extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    this.globalEnv = this.env;
    while (this.globalEnv.rules === undefined) {
      this.globalEnv = this.globalEnv.enclosing;
    }
  }

  typecheck() {}

  execute() {
    this.globalEnv.vars.forEach((mvar, name) => {
      mvar.assign(mvar.type.makeDefaultValue());
    });
    // TODO: how to run global initialization?
    // module.ast.execute(context);
  }
}

module.exports = Reset;
