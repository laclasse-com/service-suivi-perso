all: public/app/js/app.min.js

# find public/app/ts -type f -exec echo -n {}\  \;
public/app/js/app.js: public/app/ts/resources/onglets.ts public/app/ts/resources/carnets.ts public/app/ts/resources/user.ts public/app/ts/resources/saisies.ts public/app/ts/resources/droits.ts public/app/ts/routes.ts public/app/ts/services/popups.ts public/app/ts/services/apis.ts public/app/ts/app.ts public/app/ts/components/carnet.ts public/app/ts/components/onglets.ts public/app/ts/components/onglet.ts public/app/ts/components/user_details.ts public/app/ts/components/droits.ts public/app/ts/components/saisie.ts public/app/ts/components/trombinoscope.ts
	-./public/app/node_modules/.bin/tsc --project ./public/app/tsconfig.json

public/app/js/app.min.js: public/app/js/app.js
	./public/app/node_modules/.bin/google-closure-compiler-js $^ > $@

pull-deps:
	bundle install --path .bundle
	cd public/app; npm install

clean:
	-rm public/app/js/app.min.js public/app/js/app.js

clean-all: clean
	-rm -fr .bundle/ruby/
	-rm -fr public/app/node_modules
