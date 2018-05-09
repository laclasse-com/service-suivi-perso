all: public/js/app.min.js

# find public/ts -type f -exec echo -n {}\  \;
public/js/app.js: public/app.ts public/lib/apis.ts
	-./public/node_modules/.bin/tsc --project ./public/tsconfig.json

public/js/app.min.js: public/js/app.js
	./public/node_modules/.bin/google-closure-compiler-js $^ > $@

pull-deps:
	bundle install --path .bundle
	cd public; npm install

clean:
	-rm public/js/app.min.js public/js/app.js

clean-all: clean
	-rm -fr .bundle/ruby/
	-rm -fr public/node_modules

# DB
db-migrate:
	bundle exec sequel ./config/database.yml --migrate-directory ./migrations

# Pry
pry:
	RACK_ENV=development bundle exec ruby -e "require './app'; pry.binding"
