ALLJSFILES=$(shell git ls-files '*.js' '**/*.js')
TESTJSFILES=$(shell git ls-files '*-test.js' '**/*-test.js')

NODE ?= node
NPM ?= npm

ESLINT ?= $(NODE) node_modules/eslint/bin/eslint.js
JSFMT ?= $(NODE) node_modules/jsfmt/bin/jsfmt
MOCHA ?= $(node) node_modules/mocha/bin/mocha

.PHONY: all
all: bundle.js

.PHONY: setup
setup: npm_setup

npm_setup:
	$(NPM) install

.PHONY: test
test: unit-test system-test

.PNONY: unit-test
unit-test: $(TESTJSFILES)
	$(MOCHA) $^

.PHONY: system-test
system-test: system-test-parser system-test-parser-tokenring

.PHONY: system-test-parser
system-test-parser: parser.js input.model
	$(NODE) parser-main.js >output.json 2>&1 || echo Exit status $$? >>output.json
	git diff -w --exit-code output.json

.PHONY: system-test-parser-tokenring
system-test-parser-tokenring: parser.js examples/tokenring/tokenring.model
	$(NODE) parser-main.js examples/tokenring/tokenring.model >output-tokenring.json 2>&1 || echo Exit status $$? >>output-tokenring.json
	git diff -w --exit-code output-tokenring.json

.PHONY: format
format: $(ALLJSFILES)
	$(JSFMT) --write $^

.PHONY: lint
lint: $(ALLJSFILES)
	$(ESLINT) $(ALLJSFILES)

README.html: README.md
	markdown $< >$@

LANGUAGE-GUIDE.html: LANGUAGE-GUIDE.md
	markdown $< >$@

JAVASCRIPT-API.html: JAVASCRIPT-API.md
	markdown $< >$@
