.PHONY: dist

all: node_modules vendor dist

node_modules:
	npm i
	make vendor

vendor:
	rm -rf ./vendor
	mkdir vendor
	./node_modules/.bin/browserify -r bip39 -s bip39 > vendor/bip39.browser.js
	./node_modules/.bin/browserify -r js-levenshtein -s js-levenshtein > vendor/js-levenshtein.js
	curl https://code.jquery.com/jquery-3.5.1.min.js > vendor/jquery-3.5.1.min.js
	curl https://www.w3schools.com/w3css/4/w3.css > vendor/w3.css

dist:
	rm -rf dist
	rm -f dist.zip
	mkdir dist
	cp -r vendor dist/
	cp index.html dist/
	cp main.js dist/
	zip dist.zip -r dist/

clean:
	rm -rf node_modules
	rm -rf vendor
	rm -rf dist
