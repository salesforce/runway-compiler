/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let factory = {};
module.exports = factory;
// export empty object before requiring circular dependencies

let errors = require('../errors.js');
let ArrayType = require('./array.js');
let Either = require('./either.js');
let Integer = require('./integer');
let Output = require('./output.js');
let Range = require('./range.js');
let RecordType = require('./record.js');
let VarLen = require('./varlen.js');

let make = function(decl, env, name) {
  if (decl.kind == 'range') {
    return new Range.Type(decl, env, name);
  } else if (decl.kind == 'record') {
    return new RecordType(decl, env, name);
  } else if (decl.kind == 'either') {
    return new Either.Type(decl, env, name);
  } else if (decl.kind == 'Integer') {
    return new Integer.Type(decl, env, name);
  } else if (decl.kind == 'alias') {
    let t = env.getType(decl.value);
    if (t === undefined) {
      throw new errors.Lookup(`Unknown type ${decl.value}`);
    }
    return t;
  } else if (decl.kind == 'generic') {
    if (decl.base.value == 'Array') {
      return new ArrayType.Type(decl, env, name);
    } else if (decl.base.value == 'MultiSet') {
      return new VarLen.MultiSetType(decl, env, name);
    } else if (decl.base.value == 'Output') {
      return new Output.Type(decl, env, name);
    } else if (decl.base.value == 'OrderedSet') {
      return new VarLen.OrderedSetType(decl, env, name);
    } else if (decl.base.value == 'Vector') {
      return new VarLen.VectorType(decl, env, name);
    } else if (decl.base.value == 'Set') {
      return new VarLen.SetType(decl, env, name);
    } else {
      throw new errors.Unimplemented(`Unknown type '${decl.base.value}'`);
    }
  }
  let o = JSON.stringify(decl, null, 2);
  throw new errors.Unimplemented(`Unknown type '${name}': ${o}`);
};

factory.make = make;
