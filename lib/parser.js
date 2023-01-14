/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let errors = require('./errors.js');
let Source = require('./source.js');
let Parsimmon = require('parsimmon');


////////// Helpers //////////

// Calls anonymous function immediatey. Used to make clear when anonymous
// functions are used only for scoping, as in the following example:
//   let x = call(function() {
//     let tmp = 3;
//     return tmp * tmp;
//   });
let call = function(fn) {
  return fn();
};

// Like .mark() except puts start and end in a 'source' attribute hanging off value.
// The 'input' attribute of the Source values is set later in parse().
Parsimmon.Parser.prototype.source = function() {
  return Parsimmon.Parser.prototype.mark.call(this).map((marked) => {
    marked.value.source = new Source(marked.start, marked.end);
    return marked.value;
  });
};

// Case-insensitive string match that's not followed by a word character. The
// latter check is what prevents two keywords from slamming into each other with
// no intervening spaces or things like ifFalse (see issue #16: "Whitespace is
// incorrectly ignored by the parser for lexemes").
let istring = function(str) {
  let len = str.length;
  let expected = "'" + str + "'";
  str = str.toLowerCase();
  return Parsimmon.custom(function(success, failure) {
    return function(stream, i) {
      let head = stream.slice(i, i + len);
      let next = stream.charAt(i + len);
      if (head.toLowerCase() === str && next.match(/\w/) === null) {
        return success(i + len, head);
      } else {
        return failure(i, expected);
      }
    };
  });
};


let alt = Parsimmon.alt;
let lazy = Parsimmon.lazy;
let regex = Parsimmon.regex;
let sepBy = Parsimmon.sepBy;
let sepBy1 = Parsimmon.sepBy1;
let seqMap = Parsimmon.seqMap;
let string = Parsimmon.string;
let whitespace = Parsimmon.whitespace;

let sepByOptTrail = function(content, separator) {
  return sepBy(content, separator)
    .skip(separator.or(Parsimmon.succeed()));
};
let sepBy1OptTrail = function(content, separator) {
  return sepBy1(content, separator)
    .skip(separator.or(Parsimmon.succeed()));
};


let comment = call(function() {
  let eolComment = regex(/\/\/[^\n]*/); // this kind
  let multilineComment = Parsimmon.custom(function(success, failure) {
    return function(stream, i) {
      if (stream.slice(i, i + 2) === '/*') {
        for (let j = i + 2; j + 2 <= stream.length; ++j) {
          if (stream.slice(j, j + 2) === '*/') {
            return success(j + 2, 'multi-line comment');
          }
        }
        return failure(i, "'*/'");
      } else {
        return failure(i, "'/*'");
      }
    };
  });
  return eolComment
    .or(multilineComment)
    .desc('comment');
});

let lexeme = function(p) {
  return p.skip(whitespace.or(comment).many());
};

let arrow = lexeme(string('->'));
let bang = lexeme(string('!'));
let colon = lexeme(string(':'));
let comma = lexeme(string(','));
let dot = lexeme(string('.'));
let dots = lexeme(string('..'));
let doubleAnd = lexeme(string('&&'));
let doubleArrow = lexeme(string('=>'));
let doubleEquals = lexeme(string('=='));
let doublePipe = lexeme(string('||'));
let equals = lexeme(string('='));
let langle = lexeme(string('<'));
let lbrace = lexeme(string('{'));
let lbracket = lexeme(string('['));
let leq = lexeme(string('<='));
let lparen = lexeme(string('('));
let minus = lexeme(string('-'));
let minusEquals = lexeme(string('-='));
let percent = lexeme(string('%'));
let percentEquals = lexeme(string('%='));
let neq = lexeme(string('!='));
let plus = lexeme(string('+'));
let plusEquals = lexeme(string('+='));
let rangle = lexeme(string('>'));
let rbrace = lexeme(string('}'));
let rbracket = lexeme(string(']'));
let req = lexeme(string('>='));
let rparen = lexeme(string(')'));
let semicolon = lexeme(string(';'));
let slash = lexeme(string('/'));
let slashEquals = lexeme(string('/='));
let star = lexeme(string('*'));
let starEquals = lexeme(string('*='));

let keywordList = [
  'as',
  'assert',
  'break',
  'continue',
  'either',
  'else',
  'external',
  'for',
  'function',
  'if',
  'in',
  'invariant',
  'match',
  'node',
  'param',
  'print',
  'record',
  'reset',
  'return',
  'rule',
  'type',
  'var',
  'while',
];

let keywords = {};
keywordList.forEach((keyword) => {
  keywords[keyword] = lexeme(istring(keyword));
});

let numberWithUnit = call(function() {
  let re = /([0-9]+)([a-z]+)/i;
  return lexeme(regex(re))
    .map((s) => {
      let result = re.exec(s);
      return {
        kind: 'numberWithUnit',
        number: result[1],
        unit: result[2],
      };
    })
    .source()
    .desc('number with unit');
});
let number = lexeme(regex(/[0-9]+/).map(parseInt)).desc('number').map((v) => ({
  kind: 'number',
  value: v,
})).source();
let id = lexeme(regex(/[a-z_]\w*/i)).desc('identifier').map((v) => ({
  kind: 'id',
  value: v,
})).source();


////////// Expressions //////////

let lhs = call(function() {
  let lhsmore = lazy(() => alt(
      seqMap(lbracket,
        expr,
        rbracket,
        (_, expr, _2) => ({
          kind: 'index',
          by: expr,
        })),
      seqMap(dot,
        id,
        (_, id) => ({
          kind: 'lookup',
          child: id,
        }))));

  let lhshelper = function(lhsparent, more) {
    if (more.length == 0) {
      return lhsparent;
    }
    let ret = more.shift(0);
    ret.parent = lhsparent;
    return lhshelper(ret, more);
  };

  return seqMap(id,
    lhsmore.many(),
    lhshelper);
});

let expr = call(function() {
  let group = lazy(() => {
    return lparen.then(expr).skip(rparen);
  });

  let expr0 = lazy(() => alt(
      numberWithUnit,
      number,
      recordvalue,
      group,
      seqMap(id,
        lparen,
        sepBy(expr, comma),
        rparen,
        (func, _, args, _2) => ({
          kind: 'apply',
          func: func,
          args: args,
        })),
      seqMap(generic,
        lparen,
        sepBy(expr, comma),
        rparen,
        (generic, _, args, _2) => ({
          kind: 'apply',
          func: generic.base,
          genericargs: generic.args,
          args: args,
        })),
      lhs));

  let expr1 = lazy(() => alt(
      seqMap(bang.mark(),
        expr0,
        (bang, v) => ({
          kind: 'apply',
          func: bang,
          args: [v]
        })).source(),
      expr0));

  // Order of parsers in this table defines precedence.
  let binop = [
    alt(star, slash, percent),
    alt(plus, minus),
    alt(leq, req, langle, rangle),
    alt(neq, doubleEquals),
    doubleAnd,
    doublePipe,
  ];

  // This parser is "(exprprev op exprcurr) | (exprprev)", just rewritten as
  // "exprprev [op exprcurr]" to be more efficient.
  let makeBinopParser = (exprprev, ops, exprcurr) => seqMap(
      exprprev,
      seqMap(
        ops.mark(),
        exprcurr,
        (op, right) => ((left) => ({
          kind: 'apply',
          func: op,
          args: [left, right]
        }))).times(0, 1),
      (left, rest) => {
        if (rest.length == 0) {
          return left;
        } else {
          return rest[0](left);
        }
      }).source();

  let expr3 = binop.reduce((exprprev, ops) => {
    let exprcurr = lazy(() => makeBinopParser(exprprev, ops, exprcurr));
    return exprcurr;
  }, expr1);

  return expr3.desc('expression');
});


////////// Types //////////

let range = seqMap(expr, dots, expr,
  (low, _, high) => ({
    kind: 'range',
    low: low,
    high: high
  })).source();

let fieldlist = call(function() {
  let field = lazy(() => seqMap(
      id,
      colon,
      complexType.or(type),
      (id, _, type) => ({
        id: id,
        type: type
      })));

  return sepByOptTrail(field, comma).map((fields) => ({
    kind: 'record',
    fields: fields
  }));
});

let recordvalue = call(function() {
  let fieldvalue = lazy(() => seqMap(
      id,
      colon,
      expr,
      (id, _, expr) => ({
        id: id,
        expr: expr,
      })));
  return seqMap(id,
    lbrace,
    sepByOptTrail(fieldvalue, comma),
    rbrace,
    (id, _, fields, _2) => ({
      kind: 'recordvalue',
      type: id,
      fields: fields,
    }));
});

let record = alt(keywords.node, keywords.record)
  .skip(lbrace)
  .then(fieldlist)
  .skip(rbrace);

let either = call(function() {
  let eitherfield = seqMap(id,
    lbrace,
    fieldlist,
    rbrace,
    (id, _, fields, _2) => ({
      id: id,
      type: fields,
    })).or(id.map((id) => ({
      id: id,
      kind: 'enumvariant',
    })));
  let eitherfieldlist = sepBy1OptTrail(eitherfield, comma);

  return keywords.either
    .skip(lbrace)
    .then(eitherfieldlist.map((fields) => ({
      kind: 'either',
      fields: fields
    })))
    .skip(rbrace).source();
});

let generic = lazy(() => seqMap(id,
    langle,
    type,
    rangle,
    (base, _, arg, _2) => ({
      kind: 'generic',
      base: base,
      args: [arg],
    })));

let genericIndexable = lazy(() => seqMap(generic,
    lbracket,
    type,
    rbracket,
    (generic, _, indexBy, _2) => {
      generic.indexBy = indexBy;
      return generic;
    }));

let type = alt(
  Parsimmon.string('Integer').map(() => ({ kind: 'Integer' })),
  range,
  genericIndexable,
  generic,
  id.map((id) => {
    id.kind = 'alias';
    return id;
  }));

let complexType = Parsimmon.alt(
  record,
  either);


////////// Statements //////////

let typedecl = seqMap(keywords.type,
  id,
  colon,
  alt(complexType.skip(semicolon.times(0, 1)),
    type.skip(semicolon)),
  (_, id, _2, type) => ({
    kind: 'typedecl',
    id: id,
    type: type,
  }));


let vardecl = seqMap(keywords.var,
  id,
  colon,
  type,
  equals.then(expr).times(0, 1),
  semicolon,
  (_, id, _2, type, value, _3) => {
    let o = {
      'kind': 'vardecl',
      id: id,
      type: type,
    };
    if (value.length > 0) {
      o.default = value[0];
    }
    return o;
  });


let param = seqMap(keywords.param,
  id,
  colon,
  type,
  equals.then(expr).times(0, 1),
  semicolon,
  (_, id, _2, type, value, _3) => {
    let o = {
      'kind': 'paramdecl',
      id: id,
      type: type,
    };
    if (value.length > 0) {
      o.default = value[0];
    }
    return o;
  });


let block = lazy(() => {
  return lbrace
    .then(statement.many()).map((statements) => ({
      kind: 'block',
      code: {
        kind: 'sequence',
        statements: statements,
      },
    }))
    .skip(rbrace);
});

let functionDecl = call(function() {
  let param = seqMap(id,
    colon,
    type,
    (id, _, type) => ({
      id: id,
      type: type,
    })).source();

  let paramlist = lparen
    .then(sepBy(param, comma))
    .skip(rparen);

  return seqMap(keywords['function'],
    id,
    paramlist,
    arrow,
    type,
    block,
    (subkind, id, params, _2, returntype, block) => ({
      kind: 'function',
      id: id,
      params: params,
      returntype: returntype,
      code: block
    })).or(seqMap(keywords['function'],
    id,
    paramlist,
    block,
    (subkind, id, params, block) => ({
      kind: 'function',
      id: id,
      params: params,
      returntype: null,
      code: block
    })));
});

let returnStmt = keywords.return
  .then(expr).map((expr) => ({
    kind: 'returnstmt',
    expr: expr,
  }))
  .skip(semicolon);

let match = call(function() {
  let asClause = seqMap(keywords.as,
    id,
    (_1, id) => id).or(seqMap(lparen,
    id,
    rparen,
    (_1, id, _2) => id));
  let matchvariant = seqMap(id,
    asClause.times(0, 1),
    doubleArrow.times(0, 1),
    block,
    (type, as, _2, block) => ({
      kind: 'matchvariant',
      type: type,
      id: as.length > 0 ? as[0] : undefined,
      code: block,
    }));
  return seqMap(keywords.match,
    expr,
    lbrace,
    sepBy1OptTrail(matchvariant, comma.times(0, 1)),
    rbrace,
    (_, expr, _2, variants, _3) => ({
      kind: 'match',
      expr: expr,
      variants: variants,
    }));
});

let assignment = seqMap(
  lhs,
  equals,
  expr,
  semicolon,
  (lhs, _, rhs, _2) => ({
    kind: 'assign',
    lhs: lhs,
    rhs: rhs,
  })).or(seqMap(
    lhs,
    alt(plusEquals, minusEquals, starEquals, slashEquals, percentEquals).mark(),
    expr,
    semicolon,
    (lhs, op, rhs, _) => {
      op.value = op.value[0];
      return {
        kind: 'assign',
        lhs: lhs,
        rhs: {
          kind: 'apply',
          func: op,
          args: [lhs, rhs],
        },
      };
    }));

let print = seqMap(
  keywords.print,
  expr,
  semicolon,
  (_, expr, _2) => ({
    kind: 'print',
    expr: expr,
  }));

let assert = seqMap(
  keywords.assert,
  expr.source(),
  semicolon,
  (_, expr, _2) => ({
    kind: 'assert',
    expr: expr,
  })).source();

let foreachLoop = seqMap(keywords.for,
  id.skip(comma).times(0, 1),
  id,
  keywords.in,
  expr,
  block,
  (_, index, value, _2, expr, block) => ({
    kind: 'foreach',
    index: index.length == 1 ? index[0] : undefined,
    value: value,
    expr: expr,
    code: block,
  }));

let whileLoop = seqMap(keywords.while,
  expr,
  block,
  (_, expr, block) => ({
    kind: 'while',
    expr: expr,
    code: block,
  }));

let ifElse = lazy(() => {
  return seqMap(keywords.if,
    expr,
    block,
    (keywords.else).then(alt(block, ifElse.source().map((elseIf) =>({
      kind: 'block',
      code: {
        kind: 'sequence',
        statements: [elseIf],
      },
    })))).times(0, 1).map((elses) => {
      if (elses.length == 0) {
        return {
          kind: 'sequence',
          statements: [],
        };
      } else {
        return elses[0];
      }
    }),
    (_, condition, thenblock, elseblock) => ({
      kind: 'ifelse',
      condition: condition,
      thenblock: thenblock,
      elseblock: elseblock,
    })
  );
});

let invariant = seqMap(keywords.invariant,
  id,
  block,
  (_, id, block) => ({
    kind: 'invariant',
    id: id,
    code: block,
  }));

let rulefor = seqMap(keywords.for,
  id.skip(comma).times(0, 1),
  id,
  keywords.in,
  expr,
  (_1, index, value, _2, expr) => ({
    index: index.length == 1 ? index[0] : undefined,
    value: value,
    expr: expr,
  }));

let rule = seqMap(alt(keywords.rule, keywords.external),
  id,
  rulefor.many(),
  block,
  (subkind, id, loops, block) => ({
    kind: loops.length > 0 ? 'rulefor' : 'rule',
    subkind: subkind,
    id: id,
    loops: loops.length > 0 ? loops : undefined,
    code: block,
  }));

let breakStmt = seqMap(keywords.break,
  semicolon,
  () => ({
    kind: 'break',
  })).source();

let continueStmt = seqMap(keywords.continue,
  semicolon,
  () => ({
    kind: 'continue',
  })).source();

let resetStmt = seqMap(keywords.reset,
  semicolon,
  () => ({
    kind: 'reset',
  })).source();

let statement = Parsimmon.alt(
  param,
  typedecl,
  functionDecl,
  ifElse,
  invariant,
  foreachLoop,
  match,
  assignment,
  print,
  assert,
  rule,
  returnStmt,
  vardecl,
  breakStmt,
  continueStmt,
  resetStmt,
  whileLoop,
  expr.skip(semicolon).map(v => ({
    kind: 'do',
    expr: v,
  }))).source();


////////// Main parser (entry point) //////////

let file = lazy(() => {
  return lexeme(string('')).then(statement.many()).map((statements) => ({
    kind: 'sequence',
    statements: statements,
  }));
});

// Given an instance of Input, attempt to parse it.
// Either returns an AST or throws an Error.
let parse = function(input) {
  let r = file.parse(input.getText());
  if (r.status) {
    let setInputAll = (obj) => {
      for (var property in obj) {
        var value = obj[property];
        if (value instanceof Source) {
          value.setInput(input);
        } else if (typeof value == 'object') {
          setInputAll(value);
        }
      }
    };
    setInputAll(r.value);
    return r.value;
  } else {
    let at = input.lookup(r.index.offset);
    let expected = [];
    r.expected.forEach((v) => {
      if (expected.indexOf(v) == -1) {
        expected.push(v);
      }
    });
    expected = expected.sort();
    let error = new errors.Parse(`Parsing failed in ${input.filename} at line ${at.line}, col ${at.col}:
${input.highlight(at)}
Expected one of: ${expected.join(', ')}`);
    error.input = input;
    error.failAt = r.at;
    error.expected = expected;
    throw error;
  }
};
module.exports = {
  parse: parse,
  keywords: keywordList,
};
