/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let Environment = require('../environment.js').Environment;
let Statement = require('./statement.js');
let makeStatement = require('./factory.js');

class Block extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    this.innerEnv = new Environment(this.env);
    this.inner = makeStatement.make(this.parsed.code, this.innerEnv);
  }

  typecheck() {
    this.inner.typecheck();
  }

  execute(context) {
    this.innerEnv.vars.forEachLocal(v => v.assign(v.type.makeDefaultValue()));
    this.inner.execute(context);
  }

  toString(indent) {
    return `${indent} {
${this.inner.toString(indent + '  ')}
}`;
  }
}

module.exports = Block;
