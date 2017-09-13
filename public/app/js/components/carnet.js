'use strict';
angular.module('suiviApp')
    .component('carnet', { bindings: { uidEleve: '<' },
    template: "\n<div class=\"col-md-4 gris1-moins aside aside-carnet\">\n    <a class=\"col-md-12 btn btn-lg noir-moins go-back\" ui:sref=\"trombinoscope()\"> \u21B0 Retour au trombinoscope </a>\n\n    <user-details class=\"user-details eleve\"\n                  uid=\"$ctrl.uidEleve\"\n                  show-avatar=\"true\"\n                  show-emails=\"true\"\n                  show-classe=\"true\"\n                  show-birthdate=\"true\"\n                  show-address=\"true\"\n                  show-concerned-people=\"true\"></user-details>\n</div>\n\n<onglets class=\"col-md-8 carnet\"\n         uid-eleve=\"$ctrl.uidEleve\"></onglets>\n"
});
