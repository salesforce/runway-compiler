"use strict";

let makeExpression = require('../expressions/factory.js');
let Environment = require('../environment.js').Environment;
let Statement = require('./statement.js');
let Types = require('../types/types.js');
let makeStatement = require('./factory.js');
let errors = require('../errors.js');
let _ = require('lodash');

class RuleFor extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    this.external = this.parsed.subkind === 'external';
    this.loops = this.parsed.loops.map(loop => ({
      expr: makeExpression.make(loop.expr, this.env),
      parsed: loop,
    }));
    this.innerEnv = new Environment(this.env);
    this.inner = makeStatement.make(this.parsed.code, this.innerEnv);
    this.env.assignRule(this.parsed.id.value, this);
  }

  typecheck() {
    this.loops.forEach(loop => {
      loop.expr.typecheck();
      if (!Types.implementsIterable(loop.expr.type)) {
        throw new errors.Type(`Cannot iterate on a ${loop.expr.type} ` +
          `at ${loop.expr.source}`);
      }
      let dummyValue = loop.expr.type.valuetype.makeDefaultValue();
      this.innerEnv.vars.set(loop.parsed.value.value, dummyValue, loop.parsed.value.source);
      if (loop.parsed.index !== undefined) {
        let dummyIndex = loop.expr.type.indextype.makeDefaultValue();
        this.innerEnv.vars.set(loop.parsed.index.value, dummyIndex, loop.parsed.value.source);
      }
    });
    this.inner.typecheck();
  }

  execute() {
    // do nothing
  }

  fire(indexArg, context) {
    this.loops.forEach((loop, i) => {
      // index might come in as a plain JS number, but we want it in a proper
      // value.
      let index = loop.expr.type.indextype.makeDefaultValue();
      if (this.loops.length == 1 && indexArg === undefined) {
        // no index given, fire the first one
      } else if (this.loops.length == 1 && !(indexArg instanceof Array)) {
        index.assign(indexArg);
      } else {
        index.assign(indexArg[i]);
      }

      let array = loop.expr.evaluate(context);
      let value = array.index(index);
      // This is a little dangerous in that it assumes that no one ever does a
      // getVar and holds onto it.
      this.innerEnv.vars.shadow(loop.parsed.value.value, value);
      if (loop.parsed.index !== undefined) {
        this.innerEnv.vars.get(loop.parsed.index.value).assign(index);
      }
    });
    this.inner.execute(context);
  }

  enumerate(context) {
    let results = [];
    let helper = (prefix, ranges) => {
      if (ranges.length == 0) {
        results.push(prefix);
      } else {
        _.first(ranges).forEach(i => {
           helper(prefix.concat(i), _.tail(ranges));
        });
      }
    };
    helper([], this.loops.map(loop => {
      let array = loop.expr.evaluate(context); // fill in readset for caller
      return array.map((v, i) => i);
    }));
    return results;
  }

  toString(indent) {
    return `${indent}rule ${this.parsed.id.value} for ... in ... {
${this.inner.toString(indent + '  ')}
}`;
  }
}

module.exports = RuleFor;
