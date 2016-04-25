"use strict";

let Output = {};
module.exports = Output;

let makeType = require('./factory.js');
let Type = require('./type.js');
let Value = require('./value.js');

class OutputValue extends Value {
  constructor(type) {
    super(type);
    this.isConstant = true;
  }
  toString() {
    return `(Output)`;
  }

  toJSON() {
    return {};
  }
  push(v, context) {
    let name = '?';
    this.type.env.vars.forEach((evar, ename) => {
      if (evar == this) {
        name = ename;
      }
    });
    if (context.output === undefined) {
      console.log('created output');
      context.output = {};
    }
    if (context.output[name] === undefined) {
      context.output[name] = [];
    }
    context.output[name].push(v.toJSON());
  }
  assign(v) {
    // needed for reset statement
  }
}

class OutputType extends Type {
  constructor(decl, env, name) {
    super(decl, env, name);
    this.valuetype = makeType.make(this.decl.args[0], this.env);
  }
  makeDefaultValue() {
    return new OutputValue(this);
  }
  toString() {
    return `Output<${this.valuetype}>`;
  }
}

Output.Type = OutputType;
Output.Value = OutputValue;
