// This file copies two short functions from the Parsimmon library that aren't
// included in the current NPM version. There's a request to release a new NPM
// version at https://github.com/jneen/parsimmon/issues/57, but here's the
// workaround until that is resolved.

// The code below comes straight from Parsimmon and is covered by Parsimmon's
// MIT license, as reproduced here.
//
// MIT license.  See http://www.opensource.org/licenses/mit-license.php
//
// Copyright (c) 2011-2016 J. Adkisson (http://jneen.net).
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


var Parsimmon = require('parsimmon');
var Parser = Parsimmon.Parser;

// BEGIN CHUNK OF CODE FROM PARSIMMON LIBRARY

  function assertParser(p) {
    if (!(p instanceof Parser)) throw new Error('not a parser: '+p);
  }

  var sepBy = Parsimmon.sepBy = function(parser, separator) {
    // Argument asserted by sepBy1
    return sepBy1(parser, separator).or(Parsimmon.of([]));
  };

  var sepBy1 = Parsimmon.sepBy1 = function(parser, separator) {
    assertParser(parser);
    assertParser(separator);

    var pairs = separator.then(parser).many();

    return parser.chain(function(r) {
      return pairs.map(function(rs) {
        return [r].concat(rs);
      })
    })
  };

// END CHUNK OF CODE FROM PARSIMMON LIBRARY

module.exports = Parsimmon;
