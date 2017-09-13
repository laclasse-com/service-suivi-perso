'use strict';
angular.module('suiviApp')
    .component('onglets', { bindings: { uidEleve: '<' },
    controller: ['$uibModal', 'Carnets', 'Onglets', 'Popups',
        function ($uibModal, Carnets, Onglets, Popups) {
            var ctrl = this;
            ctrl.popup_onglet = Popups.onglet;
            ctrl.callback_popup_onglet = function (onglet) {
                if (onglet.created) {
                    ctrl.onglets.push(onglet);
                }
            };
            ctrl.$onInit = function () {
                Carnets.get({ uid_eleve: ctrl.uidEleve }).$promise
                    .then(function success(response) {
                    ctrl.carnet = response;
                    Onglets.query({ uid_eleve: ctrl.uidEleve }).$promise
                        .then(function success(response) {
                        ctrl.onglets = response;
                    }, function error(response) { });
                }, function error(response) { });
            };
        }],
    template: "\n<uib-tabset>\n    <uib-tab ng:repeat=\"onglet in $ctrl.onglets\">\n        <uib-tab-heading> {{onglet.nom}} </uib-tab-heading>\n\n        <onglet uid-eleve=\"$ctrl.uidEleve\"\n                onglets=\"$ctrl.onglets\"\n                onglet=\"onglet\"></onglet>\n    </uib-tab>\n\n    <li>\n        <a href\n           class=\"bleu add-onglet\"\n           ng:click=\"$ctrl.popup_onglet( $ctrl.uidEleve, null, $ctrl.onglets, $ctrl.callback_popup_onglet )\">\n            <span class=\"glyphicon glyphicon-plus\"></span>\n        </a>\n    </li>\n</uib-tabset>\n"
});
