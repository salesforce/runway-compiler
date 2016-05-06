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
let makeType = require('../types/factory.js');
let Statement = require('./statement.js');
let Types = require('../types/types.js');

// var x : Boolean;
// var x : Boolean = False;
// var x : Boolean = (False == False);

class VarDecl extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    let type = makeType.make(this.parsed.type, this.env);
    this.value = type.makeDefaultValue();
    this.env.vars.set(this.parsed.id.value, this.value, this.parsed.source);
    if (this.parsed.default === undefined) {
      this.defaultExpr = null;
    } else {
      this.defaultExpr = makeExpression.make(this.parsed.default, this.env);
    }
  }

  typecheck() {
    if (this.defaultExpr !== null) {
      this.defaultExpr.typecheck();
      if (!Types.subtypeOf(this.defaultExpr.type, this.value.type)) {
        throw new errors.Type(`Cannot assign ${this.defaultExpr.type} to variable of type ${this.value.type}`);
      }
    }
  }

  execute(context) {
    if (this.defaultExpr !== null) {
      this.value.assign(this.defaultExpr.evaluate(context));
    }
  }

  toString(indent) {
    if (indent === undefined) {
      indent = '';
    }
    let defVal = '';
    if (this.defaultExpr !== null) {
      defVal = ` = ${this.defaultExpr}`;
    }
    return `${indent}var ${this.parsed.id.value} : ${this.value.type}${defVal};`;
  }
}

module.exports = VarDecl;
