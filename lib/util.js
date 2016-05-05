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
