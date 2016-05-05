'use strict';

let errors = require('../errors.js');
let Environment = require('../environment.js').Environment;
let makeExpression = require('../expressions/factory.js');
let makeStatement = require('./factory.js');
let Statement = require('./statement.js');
let EitherType = require('../types/either.js').Type;

class Match extends Statement {
  constructor(parsed, env) {
    super(parsed, env);
    this.expr = makeExpression.make(this.parsed.expr, this.env);
    this.variants = new Map(this.parsed.variants.map((variant, i) => {
      let variantEnv = new Environment(this.env);
      if (variant.type.value === 'default') {
        if (i < this.parsed.variants.length - 1) {
          throw new errors.Parse(`default must be last in match ` +
            `at ${this.parsed.source}`);
        }
        if (variant.id !== undefined) {
          throw new errors.Parse(`default cannot have variable in match ` +
            `at ${this.parsed.source}`);
        }
      }
      return [variant.type.value,
        {
          id: variant.id,
          code: makeStatement.make(variant.code, variantEnv),
          env: variantEnv,
        }];
    }));
  }

  typecheck() {
    this.expr.typecheck();
    if (!(this.expr.type instanceof EitherType)) {
      throw new errors.Type(`Cannot match on a ${this.expr.type.getName()} ` +
        `at ${this.expr.source}`);
    }

    let tagsPresent = new Set();
    this.variants.forEach((variant, tag) => {
      tagsPresent.add(tag);
      if (variant.id !== undefined) {
        let value = this.expr.type.getVariant(tag).makeDefaultValue();
        variant.env.vars.set(variant.id.value, value, variant.id.source);
      }
      variant.code.typecheck();
    });

    if (!tagsPresent.has('default')) {
      this.expr.type.variants.forEach(v => {
        if (!tagsPresent.has(v.name)) {
          throw new errors.Type(`Missing variant ${v.name} in match ` +
            `at ${this.parsed.source}`);
        }
      });
    }
  }

  execute(context) {
    let value = this.expr.evaluate(context);
    let variant = this.variants.get(value.varianttype.name);
    if (variant === undefined) {
      variant = this.variants.get('default');
      if (variant === undefined) {
        throw new errors.Internal(`Bad variant: ${value.varianttype.name}`);
      }
    } else {
      if (variant.id !== undefined) {
        variant.env.getVar(variant.id.value).assign(value);
      }
    }
    variant.code.execute(context);
  }

  toString(indent) {
    return `${indent}match ${this.expr.toString(indent)} {
${indent}  ...
${indent}}`;
  }
}

module.exports = Match;
