#!/bin/bash

# Copyright (c) 2016, Salesforce.com, Inc.
# All rights reserved.
# Licensed under the MIT license.
# For full license text, see LICENSE.md file in the repo root or
# https://opensource.org/licenses/MIT

set -e

status=0

for keyword in $(cat keywords); do
  if ! (cat $* | grep "\b$keyword\b" >/dev/null); then
    echo "Error: keyword '$keyword' not found in $*"
    status=1
  fi
done

exit $status
