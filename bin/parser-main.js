/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let fs = require('fs');
let Input = require('../lib/input.js');
let parser = require('../lib/parser.js');


if (require.main === module) {
  let filename = 'test-parser/input.model';
  if (process.argv.length > 2) {
    filename = process.argv[2];
  }
  let text = fs.readFileSync(filename).toString();
  let parsed = parser.parse(new Input(filename, text));
  console.log(JSON.stringify(parsed, null, 2));
}
