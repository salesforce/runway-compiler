/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let GlobalEnvironment = require('./environment.js').GlobalEnvironment;
let Input = require('./input.js');
let compiler = require('./compiler.js');
let fs = require('fs');

let readFile = (filename) => fs.readFileSync(filename).toString();

let run = function(code) {
  let prelude = compiler.loadPrelude(readFile('lib/prelude.model'));
  let env = new GlobalEnvironment(prelude.env);
  let module = compiler.load(new Input('unit test', code), env);
  let context = {};
  module.ast.execute(context);
  return module;
};

module.exports = {
  run: run,
};
