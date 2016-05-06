#!/bin/bash

# Copyright (c) 2015-2016, Salesforce.com, Inc.
# All rights reserved.
# Licensed under the MIT license.
# For full license text, see LICENSE.md file in the repo root or
# https://opensource.org/licenses/MIT


set -e

for t in 1 2; do
  echo "parser test: input-${t}.model"
  test-parser/runtest.sh test-parser/input-${t}.model test-parser/output-${t}.json
done
