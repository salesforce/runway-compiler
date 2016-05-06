/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let stringCount = (haystack, needle) => {
  let count = 0;
  let i = -1;
  for (;;) {
    i = haystack.indexOf(needle, i + 1);
    if (i >= 0) {
      count += 1;
    } else {
      return count;
    }
  }
};

module.exports = {
  stringCount: stringCount,
};
