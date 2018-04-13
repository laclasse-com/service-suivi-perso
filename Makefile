all: public/js/app.min.js

# find public/ts -type f -exec echo -n {}\  \;
public/js/app.js: public/ts/resources/onglets.ts public/ts/resources/user.ts public/ts/resources/saisies.ts public/ts/resources/droits.ts public/ts/routes.ts public/ts/services/popups.ts public/ts/services/apis.ts public/ts/app.ts public/ts/components/student.ts public/ts/components/onglets.ts public/ts/components/onglet.ts public/ts/components/user_details.ts public/ts/components/droits.ts public/ts/components/saisie.ts public/ts/components/trombinoscope.ts
	-./public/node_modules/.bin/tsc --project ./public/tsconfig.json

public/js/app.min.js: public/js/app.js
	./public/node_modules/.bin/google-closure-compiler-js $^ > $@

pull-deps:
	bundle install --path .bundle
	cd public/app; npm install

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
