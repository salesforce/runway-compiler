/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let errors = require('../errors.js');

class Value {
  constructor(type) {
    this.type = type;
  }

  assign(other) {
    throw new errors.Type(`assign() not implemented for ${this.type} values`);
  }

  assignJSON() {
    throw new errors.Type(`assignJSON() not implemented for ${this.type} values`);
  }

  equals(other) {
    throw new errors.Type(`equals() not implemented for ${this.type} values`);
  }

  toJSON() {
    throw new errors.Type(`toJSON() not implemented for ${this.type} values`);
  }
}

module.exports = Value;
