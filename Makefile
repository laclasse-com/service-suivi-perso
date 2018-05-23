all: public/js/app.js

# find public/ts -type f -exec echo -n {}\  \;
public/js/app.js: public/node_modules/sweetalert2/dist/sweetalert2.min.js public/node_modules/angular/angular.min.js public/node_modules/angular-i18n/angular-locale_fr-fr.js public/node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js public/node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js public/node_modules/rangy/lib/rangy-core.js public/node_modules/rangy/lib/rangy-classapplier.js public/node_modules/rangy/lib/rangy-selectionsaverestore.js public/node_modules/rangy/lib/rangy-serializer.js public/node_modules/angular-resource/angular-resource.min.js public/node_modules/angular-cookies/angular-cookies.min.js public/node_modules/angular-sanitize/angular-sanitize.min.js public/node_modules/angular-animate/angular-animate.min.js public/node_modules/angular-touch/angular-touch.min.js public/node_modules/angular-loader/angular-loader.min.js public/node_modules/@uirouter/angularjs/release/angular-ui-router.js public/node_modules/textangular/dist/textAngular-sanitize.min.js public/node_modules/textangular/dist/textAngular.min.js public/node_modules/underscore/underscore-min.js public/node_modules/ng-color-picker/color-picker.js public/ts/resources/onglets.ts public/ts/resources/user.ts public/ts/resources/saisies.ts public/ts/resources/droits.ts public/ts/routes.ts public/ts/services/popups.ts public/ts/services/apis.ts public/ts/app.ts public/ts/components/student.ts public/ts/components/onglets.ts public/ts/components/onglet.ts public/ts/components/user_details.ts public/ts/components/droits.ts public/ts/components/saisie.ts public/ts/components/trombinoscope.ts
	-./public/node_modules/.bin/tsc --project ./public/tsconfig.json

pull-deps:
	bundle install --path .bundle
	cd public/app; npm install

clean:
	-rm public/js/app.js

clean-all: clean
	-rm -fr .bundle/ruby/
	-rm -fr public/node_modules

# DB
db-migrate:
	bundle exec sequel ./config/database.yml --migrate-directory ./migrations

# Pry
pry:
	RACK_ENV=development bundle exec ruby -e "require './app'; pry.binding"
