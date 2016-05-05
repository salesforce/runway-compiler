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
