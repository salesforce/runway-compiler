#!/bin/bash

# Copyright (c) 2016, Salesforce.com, Inc.
# All rights reserved.
# Licensed under the MIT license.
# For full license text, see LICENSE.md file in the repo root or
# https://opensource.org/licenses/MIT

status=0

echo "Running unit tests"
./node_modules/.bin/mocha
(( status += $? ))

echo "Running parser tests"
test-scripts/parser/runtests.sh
(( status += $? ))

echo "Checking that compiler files mention every keyword"
test-scripts/keywordcheck.sh \
  lib/expressions/apply.js \
  lib/types/factory.js \
  lib/parser.js \
  lib/prelude.model
(( status += $? ))

echo "Checking that LANGUAGE-GUIDE.md mentions every keyword"
test-scripts/keywordcheck.sh doc/LANGUAGE-GUIDE.md
(( status += $? ))

echo "Checking that runway.vim mentions every keyword"
test-scripts/keywordcheck.sh vim/runway.vim
(( status += $? ))

for dir in node_modules/language-runway ../language-runway; do
  if [ -f $dir/grammars/runway.json ]; then
    echo "Checking that language-runway mentions every keyword"
    test-scripts/keywordcheck.sh $dir/grammars/runway.json
    (( status += $? ))
    break
  fi
done

exit $status
