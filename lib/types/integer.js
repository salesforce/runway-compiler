'use strict';

const errors = require('../errors.js');
const Type = require('./type.js');
const Value = require('./value.js');

class IntegerValue extends Value {
  constructor(type) {
    super(type);
    this.value = 0;
  }

  assign(newValue) {
    if (typeof newValue == 'number') {
      this.value = newValue;
    } else if (newValue.value !== undefined && typeof newValue.value == 'number') {
      this.value = newValue.value;
    } else {
      throw new errors.Internal(`Trying to assign ${newValue.type} to Integer;`);
    }
  }

  equals(other) {
    return this.type == other.type && this.value == other.value;
  }

  innerToString() {
    return `${this.value}`;
  }

  assignJSON(spec) {
    this.value = spec;
  }

  toJSON() {
    return this.value;
  }

  toString() {
    return `${this.value}`;
  }
}

class IntegerType extends Type {
  constructor() {
    super(null, null, 'Integer');
  }
  equals(other) {
    return other === IntegerType.singleton;
  }
  makeDefaultValue() {
    return new IntegerValue(this);
  }
  toString() {
    return 'Integer';
  }
}

IntegerType.singleton = new IntegerType();

module.exports = {
  Type: IntegerType,
  Value: IntegerValue,
};
