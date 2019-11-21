.PHONY: tests

tests:
	mocha tests/lib/ezHTML_generatorTests.js

testOne:
	./node_modules/mocha/bin/mocha tests/lib/ --grep codeblock
