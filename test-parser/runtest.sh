#!/bin/bash

# Copyright (c) 2015-2016, Salesforce.com, Inc.
# All rights reserved.
# Licensed under the MIT license.
# For full license text, see LICENSE.md file in the repo root or
# https://opensource.org/licenses/MIT


set -e

(node bin/parser-main.js $1 2>&1 || echo Exit status $?) >$2
git diff -w --exit-code $2
