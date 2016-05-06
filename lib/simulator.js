/*
 * Copyright (c) 2015-2016, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the MIT license.
 * For full license text, see LICENSE.md file in the repo root or
 * https://opensource.org/licenses/MIT
 */

'use strict';

let RuleFor = require('./statements/rulefor.js');
let Changesets = require('./changesets.js');
let _ = require('lodash');

let slow = (module, controller) => {

  let simpleRules = [];
  let context = [];
  module.env.rules.forEach((rule, name) => {
    if (rule.external) {
      return;
    }
    if (rule instanceof RuleFor) {
      rule.expr.evaluate(context).forEach((v, i) => {
        simpleRules.push({
          name: `${name}(${i})`,
          fire: () => rule.fire(i, context),
        });
      });
    } else {
      simpleRules.push({
        name: name,
        fire: () => rule.fire(context),
      });
    }
  });

  simpleRules = _.shuffle(simpleRules);
  for (let rule of simpleRules) {
    let changes = controller.tryChangeState(() => {
      rule.fire();
      return rule.name;
    });
    if (!Changesets.empty(changes)) {
      return true;
    }
  }
  console.log('deadlock');
  return false;
};

class Simulator {
  constructor(module, genContext) {
    this.module = module;
    this.genContext = genContext;
  }

  step() {
    //let start = performance.now();
    let rulesets = _.reject(this.genContext.getRulesets(),
      rs => rs.source.external);
    for (;;) {
      let nextWake = Number.MAX_VALUE;
      let rules = _.flatMap(rulesets, ruleset => ruleset.rules);
      rules = _.shuffle(rules);
      for (let rule of rules) {
        if (!Changesets.empty(rule.fire())) {
          //let stop = performance.now();
          //console.log(`simulate took ${_.round(stop - start, 3)} ms`);
          return true;
        }
        nextWake = Math.min(nextWake, rule.getNextWake());
      }
      if (nextWake < Number.MAX_VALUE) {
        this.genContext.setClock(nextWake);
      } else {
        console.log('deadlock');
        return false;
      }
    }
  }

}

module.exports = {
  slow: slow,
  Simulator: Simulator,
};
