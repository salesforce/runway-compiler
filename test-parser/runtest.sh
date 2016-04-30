#!/bin/bash

set -e

(node bin/parser-main.js $1 2>&1 || echo Exit status $?) >$2
git diff -w --exit-code $2
