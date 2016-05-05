#!/bin/bash

set -e

for t in 1 2; do
  echo "parser test: input-${t}.model"
  test-parser/runtest.sh test-parser/input-${t}.model test-parser/output-${t}.json
done
