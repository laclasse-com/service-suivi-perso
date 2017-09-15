'use strict';
angular.module('suiviApp')
    .component('saisie', { bindings: { uidEleve: '<',
        onglet: '<',
        saisie: '=',
        callback: '&' },
    controller: ['$sce', 'Saisies', 'APIs',
        function ($sce, Saisies, APIs) {
            var ctrl = this;
            ctrl.toggle_edit = function () {
                ctrl.edition = !ctrl.edition;
                if (!ctrl.edition) {
                    ctrl.saisie.trusted_contenu = $sce.trustAsHtml(ctrl.saisie.contenu);
                }
            };
            ctrl.cancel = function () {
                ctrl.toggle_edit();
            };
            ctrl.save = function () {
                if (!_(ctrl.saisie).has('$save')) {
                    ctrl.saisie.onglet_id = ctrl.onglet.id;
                    ctrl.saisie.uid_eleve = ctrl.uidEleve;
                    ctrl.saisie = new Saisies(ctrl.saisie);
                }
                var promise = ctrl.new_saisie ? ctrl.saisie.$save() : ctrl.saisie.$update();
                promise.then(function success(response) {
                    if (!ctrl.new_saisie) {
                        ctrl.toggle_edit();
                    }
                    ctrl.saisie.action = ctrl.new_saisie ? 'created' : 'updated';
                    ctrl.callback();
                }, function error(response) { console.log(response); });
            };
            ctrl.delete = function () {
                swal({ title: 'Êtes-vous sur ?',
                    text: "La saisie sera définitivement supprimée !",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Oui, je confirme !',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Annuler'
                })
                    .then(function () {
                    ctrl.saisie.$delete()
                        .then(function () {
                        ctrl.saisie.action = 'deleted';
                        ctrl.callback();
                    });
                });
            };
            ctrl.$onInit = function () {
                ctrl.edition = ctrl.saisie.create_me;
                if (ctrl.saisie.create_me) {
                    ctrl.new_saisie = true;
                    ctrl.saisie.contenu = '';
                }
                else {
                    ctrl.saisie = new Saisies(ctrl.saisie);
                }
                ctrl.saisie.uid_eleve = ctrl.uidEleve;
                ctrl.saisie.trusted_contenu = $sce.trustAsHtml(ctrl.saisie.contenu);
                APIs.get_current_user()
                    .then(function (current_user) {
                    ctrl.current_user = current_user;
                    ctrl.editable = ctrl.onglet.writable && ctrl.saisie.uid_author === ctrl.current_user.id;
                });
            };
            ctrl.$onChanges = function (changes) {
                ctrl.saisie.uid_eleve = ctrl.uidEleve;
                ctrl.saisie.trusted_contenu = $sce.trustAsHtml(ctrl.saisie.contenu);
            };
        }],
    template: "\n<div class=\"panel panel-default saisie-display\">\n    <div class=\"panel-heading\" ng:if=\"$ctrl.saisie.id\">\n        <user-details class=\"col-md-4\"\n                      ng:if=\"!$ctrl.saisie.new_saisie\"\n                      uid=\"$ctrl.saisie.uid_author\"\n                      small=\"true\"\n                      show-avatar=\"true\"></user-details>\n        {{$ctrl.saisie.date_creation | date:'medium'}}\n        <div class=\"clearfix\"></div>\n    </div>\n\n    <div class=\"panel-body\" ng:style=\"{'padding': $ctrl.new_saisie ? 0 : 'inherit', 'border': $ctrl.new_saisie ? 0 : 'inherit'}\">\n\n        <div class=\"col-md-12\"\n             ng:bind-html=\"$ctrl.saisie.trusted_contenu\"\n             ng:if=\"!$ctrl.edition\"></div>\n\n        <div class=\"col-md-12\"\n             ng:style=\"{'padding': $ctrl.new_saisie ? 0 : 'inherit'}\"\n             ng:if=\"$ctrl.edition\">\n            <text-angular ta:target-toolbars=\"main-ta-toolbar-{{$ctrl.onglet.id}}-{{$ctrl.saisie.id}}\"\n                          ng:model=\"$ctrl.saisie.contenu\"\n                          ng:change=\"$ctrl.dirty = true\"></text-angular>\n            <div class=\"suivi-ta-toolbar gris2-moins\">\n                <text-angular-toolbar class=\"pull-left\"\n                                      style=\"margin-left: 0;\"\n                                      name=\"main-ta-toolbar-{{$ctrl.onglet.id}}-{{$ctrl.saisie.id}}\"></text-angular-toolbar>\n                <button class=\"btn btn-success pull-right\"\n                        ng:disabled=\"!$ctrl.dirty\"\n                        ng:click=\"$ctrl.save()\">\n                    <span class=\"glyphicon glyphicon-save\" ></span> Publier\n                </button>\n                <button class=\"btn btn-default pull-right\"\n                        ng:click=\"$ctrl.cancel()\"\n                        ng:if=\"$ctrl.saisie.id\">\n                    <span class=\"glyphicon glyphicon-edit\" ></span> Annuler\n                </button>\n                <div class=\"clearfix\"></div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"panel-footer\" ng:if=\"!$ctrl.edition\">\n        <div class=\"pull-right buttons\">\n            <button class=\"btn btn-default\"\n                    ng:click=\"$ctrl.toggle_edit()\"\n                    ng:if=\"$ctrl.editable\">\n                <span class=\"glyphicon glyphicon-edit\" ></span> \u00C9diter\n            </button>\n\n            <button class=\"btn btn-danger\"\n                    ng:click=\"$ctrl.delete()\"\n                    ng:if=\"$ctrl.saisie.id && ( $ctrl.editable || $ctrl.current_user.is_admin() )\">\n                <span class=\"glyphicon glyphicon-trash\"></span> Supprimer\n            </button>\n        </div>\n        <div class=\"clearfix\"></div>\n    </div>\n</div>\n"
});
