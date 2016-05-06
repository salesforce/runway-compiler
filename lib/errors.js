/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let prefix = 'Modeling';

class Base extends Error {
  constructor(message) {
    super(message);
    this.name = prefix + 'Error';
  }
}

class Internal extends Error {
  constructor(message) {
    super(message);
    this.name = prefix + 'InternalError';
  }
}

class Unimplemented extends Internal {
  constructor(message) {
    super(message);
    this.name = prefix + 'UnimplementedError';
  }
}

class Parse extends Base {
  constructor(message) {
    super(message);
    this.name = prefix + 'ParseError';
  }
}

class Type extends Base {
  constructor(message) {
    super(message);
    this.name = prefix + 'TypeError';
  }
}

class Lookup extends Type {
  constructor(message) {
    super(message);
    this.name = prefix + 'LookupError';
  }
}

class Runtime extends Base {
  constructor(message) {
    super(message);
    this.name = prefix + 'RuntimeError';
  }
}

class Bounds extends Runtime {
  constructor(message) {
    super(message);
    this.name = prefix + 'BoundsError';
  }
}

class Break extends Runtime {
  constructor(message) {
    super(message);
    this.name = prefix + 'BreakError';
  }
}

class Continue extends Runtime {
  constructor(message) {
    super(message);
    this.name = prefix + 'ContinueError';
  }
}

class Return extends Runtime {
  constructor(message) {
    super(message);
    this.name = prefix + 'ReturnError';
  }
}

class Assertion extends Runtime {
  constructor(message) {
    super(message);
    this.name = prefix + 'AssertionError';
  }
}

module.exports = {
  Assertion: Assertion,
  Base: Base,
  Break: Break,
  Bounds: Bounds,
  Continue: Continue,
  Internal: Internal,
  Lookup: Lookup,
  Parse: Parse,
  Return: Return,
  Runtime: Runtime,
  Type: Type,
  Unimplemented: Unimplemented,
};
