#!/bin/bash

set -e

echo "parser test: input.model"
test-parser/runtest.sh test-parser/input.model test-parser/output.json

echo "parser test: tokenring.model"
test-parser/runtest.sh examples/tokenring/tokenring.model test-parser/output-tokenring.json
