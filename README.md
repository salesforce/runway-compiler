# Runway Compiler

[![Build Status](https://travis-ci.org/salesforce/runway-compiler.svg?branch=master)](https://travis-ci.org/salesforce/runway-compiler)

This is an interpreter for the Runway specification language, which was created
to model distributed and concurrent systems. The interpreter is typically used
as part of [runway-browser](https://github.com/salesforce/runway-browser),
which provides a web-based UI in which you can run interactive visualizations
based on the models.

(We expect this repo to become a compiler over time, which is why it's called
runway-compiler and not runway-interpreter.)


## Setup

First make sure you have `node` and `npm` (node package manager) installed.
Clone this repository and run `npm install` within it to get started.

### Syntax Highlighting: Vim

Syntax highlighting for the [Vim](http://www.vim.org) text editor is available
using the syntax file [vim/runway.vim](vim/runway.vim). Copy it into
`~/.vim/syntax/` and set your filetype to `runway` in `~/.vimrc`:

    autocmd BufRead,BufNewFile *.model set filetype=runway

### Syntax Highlighting: Atom

Syntax highlighting for the [Atom](https://atom.io) text editor can be found in
a separate [language-runway](https://github.com/salesforce/language-runway)
repo.


## REPL

Use the REPL to try out statements and expressions in your console:

    $ node bin/main.js
    > 3 * 4
    12
    > type Pair : record { first: 0..9, second: 10..99 };
    > var p : Pair;
    > p
    Pair { first: 0, second: 10 }
    > p.first = 20
    ModelingBoundsError: Cannot assign value of 20 to range undefined: 0..9;
    > p.first = 3
    > p
    Pair { first: 3, second: 10 }
    > type Maybe : either { Nothing, Something { it: 3..5 } }
    > var m : Maybe
    > m
    Nothing
    > m = Something { it: 4 }
    > m
    Something { it: 4 }
    > match m { Something as s => { print s.it; }, Nothing => { print False; } }
    4
    > m = Nothing
    > match m { Something as s => { print s.it; }, Nothing => { print False; } }
    False
    >


### Running Example in REPL

You can also load Runway models into the REPL, such as the [Too Many
Bananas](https://github.com/salesforce/runway-model-toomanybananas/) model.

    $ node main.js ~/runway-model-toomanybananas/toomanybananas.model
    bananas = 0
    notePresent = False
    roommates = [1: Happy, 2: Happy, 3: Happy, 4: Happy, 5: Happy]

    Executing step
    bananas = 0
    notePresent = False
    roommates = [1: Hungry, 2: Happy, 3: Happy, 4: Happy, 5: Happy]

    > .fire step 3
    bananas = 0
    notePresent = False
    roommates = [1: Hungry, 2: Happy, 3: Hungry, 4: Happy, 5: Happy]

    > .fire step 3
    bananas = 0
    notePresent = True
    roommates = [1: Hungry, 2: Happy, 3: GoingToStore, 4: Happy, 5: Happy]

    > bananas = 7
    > .fire step 3
    bananas = 7
    notePresent = True
    roommates = [1: Hungry, 2: Happy, 3: ReturningFromStore { carrying: 3 }, 4: Happy, 5: Happy]

    > .fire step 3
    bananas = 10
    notePresent = False
    roommates = [1: Hungry, 2: Happy, 3: Hungry, 4: Happy, 5: Happy]

Note that invariants are not automatically checked in the REPL
(issue [#1](/salesforce/runway-compiler/issues/1)).


## Writing a Model

You're encouraged to look at existing examples to begin with, such as
[runway-model-toomanybananas](https://github.com/salesforce/runway-model-toomanybananas)
and
[runway-model-elevators](https://github.com/salesforce/runway-model-elevators).
The specification language is documented in
[doc/LANGUAGE-GUIDE.md](doc/LANGUAGE-GUIDE.md), and the most important thing to
note is that most things are pass-by-value (copy semantics), but for loops are
by reference.

## Internals

### Interpreter

The lexer+parser ([lib/parser.js](lib/parser.js)) is written using the
[Parsimmon](https://github.com/jneen/parsimmon) library. It outputs a really
big basically JSON parse tree like what you find in
[test-scripts/parser/output-2.json](test-scripts/parser/output-2.json).
Every object in the
parse tree has a "kind" field specifying its type and a "source" field
specifying where it comes from in the input file (for error messages).

After parsing completes, the entire structure is converting into an AST
(abstract syntax tree). There's mostly a one-to-one mapping between a node in
the parse tree and a node in the AST, but the AST is actual JavaScript objects.
There are two kinds of nodes in the AST: [statements](lib/statements/) and
[expressions](lib/expressions/). These refer to [types](lib/types/) and values
(value classes are defined next to the corresponding type).

After the AST is set up, `typecheck()` is called on it, which is invoked
through the entire tree (children before parents). Then `execute()` calls the
top-level initialization statements, if any.

### Tests

Run `npm test`.

Unit tests use the [Mocha](https://mochajs.org/) library.  To add a new test
file, place it in the `test/` directory.

The parser is tested by feeding it a couple of files
(`test-scripts/parser/input*.model`) and automatically checking their parser output
(against `test-scripts/parser/output*.json`). Eventually we'll want more targeted tests
for the parser, but this has worked pretty well so far at making sure there
aren't any regressions.
