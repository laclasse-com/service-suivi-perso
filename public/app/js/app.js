'use strict';
angular.module('suiviApp', ['ngColorPicker',
    'ngResource',
    'textAngular',
    'ui.bootstrap',
    'ui.router'])
    .constant('DEFAULT_RIGHTS_ONGLET', [
    { "profil_id": "ENS", "read": true, "write": true, "manage": true },
    { "profil_id": "EVS", "read": true, "write": true, "manage": true },
    { "profil_id": "DOC", "read": true, "write": true, "manage": true },
    { "profil_id": "DIR", "read": true, "write": true, "manage": true }
])
    .config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .config(['$provide',
    function ($provide) {
        $provide.decorator('taTranslations', ['$delegate',
            function ($delegate) {
                $delegate.html.tooltip = 'Basculer entre les vues HTML et texte enrichi';
                $delegate.justifyLeft.tooltip = 'Justifier à gauche';
                $delegate.justifyCenter.tooltip = 'Centrer';
                $delegate.justifyRight.tooltip = 'Justifier à droite';
                $delegate.bold.tooltip = 'Mettre en gras';
                $delegate.italic.tooltip = 'Mettre en italique';
                $delegate.underline.tooltip = 'Souligner';
                $delegate.insertLink.tooltip = 'Insérer un lien';
                $delegate.insertLink.dialogPrompt = 'Lien à insérer';
                $delegate.editLink.targetToggle.buttontext = 'Le lien s\'ouvrira dans une nouvelle fenêtre';
                $delegate.editLink.reLinkButton.tooltip = 'Éditer le lien';
                $delegate.editLink.unLinkButton.tooltip = 'Enlever le lien';
                $delegate.insertImage.tooltip = 'Insérer une image';
                $delegate.insertImage.dialogPrompt = 'URL de l\'image :';
                $delegate.insertVideo.tooltip = 'Insérer une vidéo';
                $delegate.insertVideo.dialogPrompt = 'URL de la vidéo Youtube :';
                $delegate.clear.tooltip = 'Enlever le formattage';
                $delegate.ul.tooltip = 'Liste';
                $delegate.ol.tooltip = 'Liste numérotée';
                $delegate.quote.tooltip = 'Citation';
                $delegate.undo.tooltip = 'Annuler';
                $delegate.redo.tooltip = 'Rétablir';
                return $delegate;
            }]);
        $provide.decorator('taOptions', ['$delegate', 'taRegisterTool',
            function (taOptions, taRegisterTool) {
                var colorpicker_taTool = function (type) {
                    var style_prefix = (type === 'backcolor') ? 'background-' : '';
                    var couleurs = ['#7bd148', '#5484ed', '#a4bdfc', '#46d6db', '#7ae7bf', '#51b749', '#fbd75b', '#ffb878', '#ff887c', '#dc2127', '#dbadff', '#e1e1e1'];
                    if (type === 'backcolor') {
                        couleurs.push('transparent');
                    }
                    return {
                        couleurs: couleurs,
                        display: '<span uib-dropdown><a uib-dropdown-toggle><i class="fa fa-font" data-ng-style="{\'' + style_prefix + 'color\': selected }"></i> <i class="fa fa-caret-down"></i></a><ng-color-picker uib-dropdown-menu selected="selected" colors="couleurs"></ng-color-picker></span>',
                        action: function () {
                            return (this.selected === 'nil') ? false : this.$editor().wrapSelection(type, this.selected);
                        }
                    };
                };
                taRegisterTool('fontColor', colorpicker_taTool('forecolor'));
                taRegisterTool('table', {
                    columns: {
                        value: 1,
                        hovered: 1
                    },
                    rows: {
                        value: 1,
                        hovered: 1
                    },
                    hover: function (objet, value) {
                        objet.hovered = value;
                    },
                    leave: function (objet) {
                        objet.hovered = objet.value;
                    },
                    tooltiptext: 'insérer un tableau',
                    display: "\n              <span uib-dropdown>\n                <a uib-dropdown-toggle>\n                  <i class=\"fa fa-table\">\n                  </i>\n                  <i class=\"fa fa-caret-down\">\n                  </i>\n                </a>\n                <div uib-dropdown-menu data-ng-click=\"$event.stopPropagation()\">\n                  <label>\n                    <span uib-rating on-hover=\"hover( columns, value )\" on-leave=\"leave( columns )\" ng-model=\"columns.value\" max=\"15\" state-on=\"'glyphicon-stop'\" state-off=\"'glyphicon-unchecked'\">\n                    </span>\n                    <br>{{columns.hovered}} colonnes\n                  </label>\n                  <br>\n                    <label>\n                      <span uib-rating on-hover=\"hover( rows, value )\" on-leave=\"leave( rows )\" ng-model=\"rows.value\" max=\"15\" state-on=\"'glyphicon-stop'\" state-off=\"'glyphicon-unchecked'\">\n                      </span>\n                      <br>{{rows.hovered}} lignes\n                    </label>\n                    <br>\n                      <button class=\"btn btn-success\" data-ng-click=\"insert_table()\">Ins\u00E9rer</button>\n                    </div>\n                  </span>\n",
                    insert_table: function () {
                        var tds = '';
                        _(this.columns.value).times(function (i) { tds = tds + '<td>&nbsp;</td>'; });
                        var trs = '';
                        _(this.rows.value).times(function (j) { trs = trs + '<tr>' + tds + '</tr>'; });
                        this.$editor().wrapSelection('insertHTML', '<table class="table table-bordered">' + trs + '</table>');
                        this.deferration.resolve();
                    },
                    action: function (deferred) {
                        this.deferration = deferred;
                        return false;
                    }
                });
                taOptions.toolbar = [['bold', 'italics', 'underline', 'ul', 'ol', 'quote', 'fontColor', 'justifyLeft', 'justifyCenter', 'justifyRight', 'table', 'insertLink', 'insertImage', 'html', 'undo', 'redo']];
                taOptions.classes = {
                    focussed: 'focussed',
                    toolbar: 'btn-toolbar',
                    toolbarGroup: 'btn-group',
                    toolbarButton: 'btn btn-default',
                    toolbarButtonActive: 'active',
                    disabled: 'disabled',
                    textEditor: 'form-control',
                    htmlEditor: 'form-control'
                };
                return taOptions;
            }]);
        $provide.decorator('taTools', ['$delegate',
            function (taTools) {
                taTools.html.buttontext = 'HTML';
                return taTools;
            }]);
    }]);
angular.module('suiviApp')
    .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('trombinoscope', {
            url: '/',
            component: 'trombinoscope'
        })
            .state('carnet', {
            url: '/carnet/:uid_eleve',
            component: 'carnet',
            resolve: {
                uidEleve: ['$transition$',
                    function ($transition$) {
                        return $transition$.params().uid_eleve;
                    }]
            }
        });
    }]);
angular.module('suiviApp')
    .component('carnet', {
    bindings: { uidEleve: '<' },
    template: "\n<div class=\"col-md-4 gris1-moins aside aside-carnet\">\n    <a class=\"col-md-12 btn btn-lg noir-moins go-back\" ui:sref=\"trombinoscope()\"> \u21B0 Retour au trombinoscope </a>\n\n    <user-details class=\"user-details eleve\"\n                  uid=\"$ctrl.uidEleve\"\n                  show-avatar=\"true\"\n                  show-emails=\"true\"\n                  show-classe=\"true\"\n                  show-birthdate=\"true\"\n                  show-address=\"true\"\n                  show-concerned-people=\"true\"></user-details>\n</div>\n\n<onglets class=\"col-md-8 carnet\"\n         uid-eleve=\"$ctrl.uidEleve\"></onglets>\n"
});
angular.module('suiviApp')
    .component('droitsOnglets', {
    bindings: {
        droits: '=',
        concernedPeople: '<'
    },
    controller: ['DroitsOnglets', 'APIs', 'UID', 'URL_ENT',
        function (DroitsOnglets, APIs, UID, URL_ENT) {
            var ctrl = this;
            ctrl.sharing_enabled = false;
            var gen_pseudo_UUID = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };
            ctrl.have_own_right = function () {
                return _.chain(ctrl.droits).findWhere({ own: true }).isUndefined();
            };
            ctrl.add = function (droit) {
                droit.new = true;
                droit.dirty = {
                    uid: false,
                    profil_id: false,
                    sharable_id: false,
                    read: false,
                    write: false,
                    manage: false
                };
                ctrl.droits.push(new DroitsOnglets(droit));
            };
            ctrl.add_sharable = function (droit) {
                droit.sharable_id = gen_pseudo_UUID();
                ctrl.add(droit);
            };
            var maybe_init_dirtiness = function (droit) {
                if (!_(droit).has('dirty')) {
                    droit.dirty = {
                        uid: false,
                        profil_id: false,
                        sharable_id: false,
                        read: false,
                        write: false,
                        manage: false
                    };
                }
            };
            ctrl.set_read = function (droit) {
                maybe_init_dirtiness(droit);
                droit.dirty.read = true;
                if (!droit.read && droit.write) {
                    droit.write = false;
                    droit.dirty.write = true;
                }
                if (!droit.read && droit.manage) {
                    droit.manage = false;
                    droit.dirty.manage = true;
                }
            };
            ctrl.set_write = function (droit) {
                maybe_init_dirtiness(droit);
                droit.dirty.write = true;
                if (droit.write && !droit.read) {
                    droit.read = true;
                    droit.dirty.read = true;
                }
                if (!droit.write && droit.manage) {
                    droit.manage = false;
                    droit.dirty.manage = true;
                }
            };
            ctrl.set_manage = function (droit) {
                maybe_init_dirtiness(droit);
                droit.dirty.manage = true;
                if (droit.manage && !droit.write) {
                    droit.write = true;
                    droit.dirty.write = true;
                }
                if (droit.manage && !droit.read) {
                    droit.read = true;
                    droit.dirty.read = true;
                }
            };
            ctrl.update_deletabilities = function () {
                var last_droit_standing = _(ctrl.droits).reject(function (droit) { return droit.to_delete; }).length == 1;
                _(ctrl.droits).each(function (droit) {
                    droit.deletable = !last_droit_standing;
                    droit.deletable = droit.deletable && !droit.own;
                });
            };
            ctrl.$onInit = function () {
                ctrl.UID = UID;
                ctrl.update_deletabilities();
                APIs.query_profiles_types()
                    .then(function success(response) {
                    ctrl.profils = response.data;
                }, function error(response) { });
            };
        }],
    template: "\n<div>\n    <label>Gestion des droits</label>\n    <table style=\"width: 100%;\">\n        <tr style=\"text-align: right;\"\n            ng:repeat=\"droit in $ctrl.droits\"\n            ng:if=\"ctrl.sharing_enabled || !droit.sharable_id\">\n            <td>\n                <label ng:if=\"droit.uid\">Personne :\n                    <select style=\"width: 250px;\"\n                            ng:model=\"droit.uid\"\n                            ng:change=\"droit.dirty.uid = true\"\n                            ng:disabled=\"droit.to_delete\"\n                            ng:options=\"people.id as people.firstname + ' ' + people.lastname group by people.type for people in $ctrl.concernedPeople\">\n                    </select>\n                </label>\n                <label ng:if=\"droit.profil_id\">Profil :\n                    <select style=\"width: 250px;\"\n                            ng:model=\"droit.profil_id\"\n                            ng:change=\"droit.dirty.profil_id = true\"\n                            ng:disabled=\"droit.to_delete\">\n                        <option ng:repeat=\"profil in $ctrl.profils track by profil.id\"\n                                ng:value=\"profil.id\">{{profil.name}}</option>\n                    </select>\n                </label>\n                <label ng:if=\"droit.sharable_id\">Partage :\n                    <input style=\"width: 250px;\"\n                           type=\"text\"\n                           ng:model=\"droit.sharable_id\"\n                           ng:change=\"droit.dirty.sharable_id = true\"\n                           ng:disabled=\"droit.to_delete\" />\n                </label>\n            </td>\n            <td>\n                <button type=\"button\" class=\"btn\"\n                        ng:class=\"{'btn-default': !droit.read, 'btn-success': droit.read}\"\n                        ng:model=\"droit.read\"\n                        ng:change=\"$ctrl.set_read( droit )\"\n                        ng:disabled=\"droit.to_delete || droit.sharable_id\"\n                        uib:btn-checkbox\n                        btn-checkbox-true=\"true\"\n                        btn-checkbox-false=\"false\"\n                        uib:tooltip=\"droit de lecture\">\n                    <span class=\"glyphicon glyphicon-eye-open\"></span>\n                </button>\n            </td>\n            <td>\n                <button type=\"button\" class=\"btn\"\n                        ng:class=\"{'btn-default': !droit.write, 'btn-success': droit.write}\"\n                        ng:model=\"droit.write\"\n                        ng:change=\"$ctrl.set_write( droit )\"\n                        ng:disabled=\"droit.to_delete || droit.sharable_id\"\n                        uib:btn-checkbox\n                        btn-checkbox-true=\"true\"\n                        btn-checkbox-false=\"false\"\n                        uib:tooltip=\"droit d'\u00E9criture\">\n                    <span class=\"glyphicon glyphicon-edit\"></span>\n                </button>\n            </td>\n            <td>\n                <button type=\"button\" class=\"btn\"\n                        ng:class=\"{'btn-default': !droit.manage, 'btn-success': droit.manage}\"\n                        ng:model=\"droit.manage\"\n                        ng:change=\"$ctrl.set_manage( droit )\"\n                        ng:disabled=\"droit.to_delete || droit.sharable_id\"\n                        uib:btn-checkbox\n                        btn-checkbox-true=\"true\"\n                        btn-checkbox-false=\"false\"\n                        uib:tooltip=\"droit d'administration\">\n                    <span class=\"glyphicon glyphicon-cog\"></span>\n                </button>\n            </td>\n            <td>\n                <button type=\"button\" class=\"btn\"\n                        ng:class=\"{'btn-default': !droit.to_delete, 'btn-warning': droit.to_delete}\"\n                        ng:disabled=\"!droit.deletable && !droit.to_delete\"\n                        ng:model=\"droit.to_delete\"\n                        ng:change=\"$ctrl.update_deletabilities()\"\n                        uib:btn-checkbox\n                        btn-checkbox-true=\"true\"\n                        btn-checkbox-false=\"false\">\n                    <span class=\"glyphicon glyphicon-trash\"></span>\n                </button>\n            </td>\n        </tr>\n        <tfoot>\n            <td colspan=\"3\">\n                <button class=\"btn btn-default\"\n                        ng:click=\"$ctrl.add({ uid: '...', read: true, write: true })\">\n                    <span class=\"glyphicon glyphicon-plus-sign\"></span> par personne\n                </button>\n\n                <button class=\"btn btn-default\"\n                        ng:click=\"$ctrl.add({ profil_id: '...', read: true, write: false })\">\n                    <span class=\"glyphicon glyphicon-plus-sign\"></span> par profil\n                </button>\n\n                <button class=\"btn btn-warning pull-right\"\n                        ng:if=\"ctrl.sharing_enabled\"\n                        ng:click=\"$ctrl.add_sharable({ read: true, write: false })\">\n                    <span class=\"glyphicon glyphicon-plus-sign\"></span> partage\n                </button>\n            </td>\n        </tfoot>\n    </table>\n</div>\n"
});
angular.module('suiviApp')
    .component('onglet', {
    bindings: {
        uidEleve: '<',
        onglets: '<',
        onglet: '='
    },
    controller: ['$uibModal', '$state', '$q', 'Saisies', 'Popups',
        function ($uibModal, $state, $q, Saisies, Popups) {
            var ctrl = this;
            ctrl.manage_onglet = Popups.onglet;
            ctrl.order_by = {
                field: 'date',
                reverse: true
            };
            ctrl.callback_popup_onglet = function (onglet) {
                if (onglet.action == 'deleted') {
                    $state.go('carnet', { uid_eleve: ctrl.uidEleve }, { reload: true });
                }
            };
            ctrl.saisie_callback = function (saisie) {
                switch (saisie.action) {
                    case 'created':
                        ctrl.saisies.push(saisie);
                        init_new_saisie();
                        break;
                    case 'deleted':
                        ctrl.saisies = _(ctrl.saisies).reject(function (s) { return s.id === saisie.id; });
                        break;
                    case 'updated':
                        break;
                    default:
                        console.log('What to do with this?');
                        console.log(saisie);
                }
            };
            var init_new_saisie = function () {
                ctrl.new_saisie = ctrl.onglet.writable ? { create_me: true } : null;
            };
            ctrl.$onInit = function () {
                init_new_saisie();
                Saisies.query({
                    onglet_id: ctrl.onglet.id
                }).$promise
                    .then(function success(response) {
                    ctrl.saisies = response;
                }, function error(response) { });
            };
        }],
    template: "\n<span class=\"hidden-xs hidden-sm floating-button toggle big off jaune\"\nng:if=\"$ctrl.onglet.manageable\"\nng:click=\"$ctrl.manage_onglet( $ctrl.uidEleve, $ctrl.onglet, $ctrl.onglets, $ctrl.callback_popup_onglet )\"></span>\n\n<saisie class=\"col-md-12\"\nstyle=\"display: inline-block;\"\nng:if=\"$ctrl.new_saisie\"\nonglet=\"$ctrl.onglet\"\nsaisie=\"$ctrl.new_saisie\"\ncallback=\"$ctrl.saisie_callback( $ctrl.new_saisie )\"></saisie>\n\n<div class=\"col-md-12\" style=\"margin-bottom: 10px;\">\n<button class=\"btn btn-sm btn-primary pull-right\"\nng:click=\"$ctrl.order_by.reverse = !$ctrl.order_by.reverse\"\nng:if=\"$ctrl.saisies.length > 1\">\n<span class=\"glyphicon\"\nng:class=\"{'glyphicon-sort-by-order': $ctrl.order_by.reverse, 'glyphicon-sort-by-order-alt': !$ctrl.order_by.reverse}\"></span>\nTrier par la date de publication la plus <span ng:if=\"$ctrl.order_by.reverse\">r\u00E9cente</span><span ng:if=\"!$ctrl.order_by.reverse\">ancienne</span>.\n</button>\n</div>\n\n<div class=\"col-md-12 saisies\" style=\"overflow-y: auto;\">\n\n<saisie class=\"col-md-12\" style=\"display: inline-block;\"\nng:repeat=\"saisie in $ctrl.saisies | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse\"\nonglet=\"$ctrl.onglet\"\nsaisie=\"saisie\"\ncallback=\"$ctrl.saisie_callback( saisie )\"></saisie>\n</div>\n"
});
angular.module('suiviApp')
    .component('onglets', {
    bindings: { uidEleve: '<' },
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
                    Onglets.query({ uid: ctrl.uidEleve }).$promise
                        .then(function success(response) {
                        ctrl.onglets = response;
                    }, function error(response) { });
                }, function error(response) { });
            };
        }],
    template: "\n      <uib-tabset>\n        <uib-tab ng:repeat=\"onglet in $ctrl.onglets\">\n          <uib-tab-heading> {{onglet.nom}} </uib-tab-heading>\n\n          <onglet uid-eleve=\"$ctrl.uidEleve\"\n                  onglets=\"$ctrl.onglets\"\n                  onglet=\"onglet\">\n          </onglet>\n        </uib-tab>\n\n        <li>\n          <a href\n          class=\"bleu add-onglet\"\n          ng:click=\"$ctrl.popup_onglet( $ctrl.uidEleve, null, $ctrl.onglets, $ctrl.callback_popup_onglet )\">\n          <span class=\"glyphicon glyphicon-plus\">\n          </span>\n        </a>\n      </li>\n    </uib-tabset>\n"
});
angular.module('suiviApp')
    .component('saisie', {
    bindings: {
        onglet: '<',
        onglets: '<',
        passive: '<',
        saisie: '=',
        callback: '&'
    },
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
                swal({
                    title: 'Êtes-vous sur ?',
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
                ctrl.saisie.trusted_contenu = $sce.trustAsHtml(ctrl.saisie.contenu);
                APIs.get_current_user()
                    .then(function (current_user) {
                    ctrl.current_user = current_user;
                    ctrl.editable = _(ctrl).has('onglets') || (ctrl.onglet.writable && ctrl.saisie.uid_author == ctrl.current_user.id);
                });
            };
            ctrl.$onChanges = function (changes) {
                ctrl.saisie.trusted_contenu = $sce.trustAsHtml(ctrl.saisie.contenu);
            };
        }],
    template: "\n                  <div class=\"panel panel-default saisie-display\">\n                    <div class=\"panel-heading\" ng:if=\"$ctrl.saisie.id\">\n                      <user-details class=\"col-md-4\"\n                                    ng:if=\"!$ctrl.saisie.new_saisie\"\n                                    uid=\"$ctrl.saisie.uid_author\"\n                                    small=\"true\"\n                                    show-avatar=\"true\"></user-details>\n                      {{$ctrl.saisie.date_creation | date:'medium'}}\n                      <div class=\"clearfix\"></div>\n                    </div>\n\n                    <div class=\"panel-body\" ng:style=\"{'padding': $ctrl.new_saisie ? 0 : 'inherit', 'border': $ctrl.new_saisie ? 0 : 'inherit'}\">\n\n                      <div class=\"col-md-12\"\n                           ng:bind-html=\"$ctrl.saisie.trusted_contenu\"\n                           ng:if=\"!$ctrl.edition\"></div>\n\n                      <div class=\"col-md-12\"\n                           ng:style=\"{'padding': $ctrl.new_saisie ? 0 : 'inherit'}\"\n                           ng:if=\"$ctrl.edition\">\n                        <text-angular ta:target-toolbars=\"main-ta-toolbar-{{$ctrl.onglet.id}}-{{$ctrl.saisie.id}}\"\n                                      ng:model=\"$ctrl.saisie.contenu\"\n                                      ng:change=\"$ctrl.dirty = true\"></text-angular>\n                        <div class=\"suivi-ta-toolbar gris2-moins\">\n                          <text-angular-toolbar class=\"pull-left\"\n                                                style=\"margin-left: 0;\"\n                                                name=\"main-ta-toolbar-{{$ctrl.onglet.id}}-{{$ctrl.saisie.id}}\"></text-angular-toolbar>\n                          <button class=\"btn btn-success pull-right\"\n                                  ng:disabled=\"!$ctrl.dirty\"\n                                  ng:if=\"!$ctrl.passive\"\n                                  ng:click=\"$ctrl.save()\">\n                            <span class=\"glyphicon glyphicon-save\" ></span> Publier\n                          </button>\n                          <button class=\"btn btn-default pull-right\"\n                                  ng:click=\"$ctrl.cancel()\"\n                                  ng:if=\"!$ctrl.passive && $ctrl.saisie.id\">\n                            <span class=\"glyphicon glyphicon-edit\" ></span> Annuler\n                          </button>\n                          <div class=\"clearfix\"></div>\n                        </div>\n                      </div>\n                    </div>\n\n                    <div class=\"panel-footer\" ng:if=\"!$ctrl.passive && !$ctrl.edition\">\n                      <div class=\"pull-right buttons\">\n                        <button class=\"btn btn-default\"\n                                ng:click=\"$ctrl.toggle_edit()\"\n                                ng:if=\"$ctrl.editable\">\n                          <span class=\"glyphicon glyphicon-edit\" ></span> \u00C9diter\n                        </button>\n\n                        <button class=\"btn btn-danger\"\n                                ng:click=\"$ctrl.delete()\"\n                                ng:if=\"$ctrl.saisie.id && ( $ctrl.editable || $ctrl.current_user.is_admin() )\">\n                          <span class=\"glyphicon glyphicon-trash\"></span> Supprimer\n                        </button>\n                      </div>\n                      <div class=\"clearfix\"></div>\n                    </div>\n                  </div>\n\n"
});
angular.module('suiviApp')
    .component('trombinoscope', {
    controller: ['$filter', '$q', 'URL_ENT', 'APIs', 'Popups',
        function ($filter, $q, URL_ENT, APIs, Popups) {
            var ctrl = this;
            ctrl.popup_onglet_batch = Popups.onglet_batch;
            ctrl.popup_onglet_batch_callback = function (feedback) { console.log(feedback); };
            ctrl.popup_publish_batch = Popups.publish_batch;
            ctrl.popup_publish_batch_callback = function (feedback) { console.log(feedback); };
            ctrl.filters = {
                text: '',
                groups: [],
                grades: []
            };
            ctrl.only_display_contributed_to = false;
            ctrl.eleves = [];
            var fix_avatar_url = function (avatar_url) {
                return (_(avatar_url.match(/^(user|http)/)).isNull() ? URL_ENT + "/" : '') + avatar_url;
            };
            ctrl.apply_filters = function () {
                var selected_groups_ids = _.chain(ctrl.groups).where({ selected: true }).pluck('id').value();
                var selected_grades_ids = _.chain(ctrl.grades).where({ selected: true }).pluck('id').value();
                return function (pupil) {
                    return ("" + pupil.firstname + pupil.lastname).toLocaleLowerCase().includes(ctrl.filters.text.toLocaleLowerCase())
                        && (selected_groups_ids.length == 0 || _(selected_groups_ids).contains(pupil.regroupement.id))
                        && (selected_grades_ids.length == 0 || _(selected_grades_ids).intersection(_(pupil.regroupement.grades).pluck('grade_id')).length > 0)
                        && (!ctrl.only_display_contributed_to || pupil.contributed);
                };
            };
            ctrl.clear_filters = function (type) {
                _(ctrl[type]).each(function (item) { item.selected = false; });
            };
            ctrl.pluck_selected_uids = function () {
                var filter = ctrl.apply_filters();
                return _.chain(ctrl.eleves)
                    .select(function (pupil) { return filter(pupil); })
                    .pluck('id')
                    .value();
            };
            ctrl.pluriel = function (item_count, character) {
                return item_count > 1 ? character : '';
            };
            APIs.get_current_user()
                .then(function (response) {
                ctrl.current_user = response;
                ctrl.current_user.avatar = fix_avatar_url(ctrl.current_user.avatar);
                ctrl.can_do_batch = !_(['TUT', 'ELV']).contains(ctrl.current_user.profil_actif.type);
                return APIs.query_carnets_contributed_to(ctrl.current_user.id);
            }, function error(response) { })
                .then(function success(response) {
                ctrl.contributed_to = _(response.data).pluck('uid_eleve');
                return APIs.get_current_user_groups();
            }, function error(response) { })
                .then(function (groups) {
                var classes = _(groups).where({ type: 'CLS' });
                if (ctrl.current_user.profil_actif.type === 'ELV') {
                    ctrl.current_user.regroupement = { libelle: classes[0].name };
                    ctrl.current_user.contributed = true;
                    ctrl.eleves = [ctrl.current_user];
                }
                else if (ctrl.current_user.profil_actif.type === 'TUT') {
                    var users_ids = _(ctrl.current_user.children).pluck('child_id');
                    if (!_(users_ids).isEmpty()) {
                        APIs.get_users(users_ids)
                            .then(function (users) {
                            ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function (eleve) {
                                eleve.avatar = fix_avatar_url(eleve.avatar);
                                var groups_ids = _(eleve.groups).pluck('group_id');
                                if (!_(groups_ids).isEmpty()) {
                                    APIs.get_groups(groups_ids)
                                        .then(function (response) {
                                        var regroupement = _(response.data).findWhere({ type: 'CLS' });
                                        if (!_(regroupement).isUndefined()) {
                                            eleve.regroupement = {
                                                id: regroupement.id,
                                                name: regroupement.name,
                                                type: regroupement.type
                                            };
                                            eleve.etablissement = regroupement.structure_id;
                                            eleve.enseignants = regroupement.profs;
                                        }
                                    });
                                }
                                return eleve;
                            }));
                        });
                    }
                }
                else {
                    APIs.get_groups(_.chain(classes)
                        .select(function (regroupement) {
                        return _(regroupement).has('structure_id') && regroupement.structure_id === ctrl.current_user.profil_actif.structure_id;
                    })
                        .pluck('id')
                        .uniq()
                        .value())
                        .then(function success(response) {
                        ctrl.groups = response.data;
                        ctrl.eleves = [];
                        APIs.get_grades(_.chain(response.data)
                            .pluck('grades')
                            .flatten()
                            .pluck('grade_id')
                            .value())
                            .then(function success(response) {
                            ctrl.grades = response.data;
                        }, function error(response) { });
                        _(response.data).each(function (regroupement) {
                            regroupement.profs = _.chain(regroupement.users).select(function (user) { return user.type === 'ENS'; }).pluck('user_id').value();
                            var users_ids = _.chain(regroupement.users).select(function (user) { return user.type === 'ELV'; }).pluck('user_id').value();
                            APIs.get_users(users_ids)
                                .then(function (users) {
                                ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function (eleve) {
                                    eleve.avatar = fix_avatar_url(eleve.avatar);
                                    eleve.contributed = _(ctrl.contributed_to).contains(eleve.id);
                                    eleve.regroupement = regroupement;
                                    eleve.etablissement = regroupement.structure_id;
                                    eleve.enseignants = regroupement.profs;
                                    return eleve;
                                }));
                            });
                        });
                    }, function error(response) { });
                }
            });
        }],
    template: "\n<style>\n  .trombinoscope .petite.case { border: 1px solid transparent; }\n</style>\n<div class=\"col-md-4 gris1-moins aside trombinoscope-aside\" style=\"padding: 0;\">\n  <div class=\"panel panel-default gris1-moins\">\n    <div class=\"panel-heading\" style=\"text-align: right; \">\n      <h3>\n        {{$ctrl.filtered.length}} \u00E9l\u00E8ve{{$ctrl.pluriel($ctrl.filtered.length, 's')}} affich\u00E9{{$ctrl.pluriel($ctrl.filtered.length, 's')}}\n      </h3>\n    </div>\n    <div class=\"panel-body\">\n\n      <div class=\"panel panel-default\" ng:if=\"$ctrl.can_do_batch\">\n        <div class=\"panel-heading\">\n          <span class=\"glyphicon glyphicon-fullscreen\"></span> Actions group\u00E9es\n        </div>\n\n        <div class=\"panel-body\">\n\n          <div class=\"btn-group\">\n            <button class=\"btn btn-success\" ng:click=\"$ctrl.popup_onglet_batch( $ctrl.pluck_selected_uids(), $ctrl.popup_onglet_batch_callback )\">\n              <span class=\"glyphicon glyphicon-folder-close\"></span> Nouvel onglet commun\n            </button>\n\n            <button class=\"btn btn-primary\" ng:click=\"$ctrl.popup_publish_batch( $ctrl.pluck_selected_uids(), $ctrl.popup_publish_batch_callback )\">\n              <span class=\"glyphicon glyphicon-pencil\"></span> Publier dans un onglet commun\n            </button>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n          <span class=\"glyphicon glyphicon-filter\"></span> Filtrage\n        </div>\n\n        <div class=\"panel-body\">\n\n          <div class=\"row\">\n            <div class=\"col-md-12\">\n              <label>\n                <input type=\"checkbox\" ng:model=\"$ctrl.only_display_contributed_to\" />\n                <h4 style=\"display: inline;\"> N'afficher que le{{$ctrl.pluriel($ctrl.contributed_to.length, 's')}} carnet{{$ctrl.pluriel($ctrl.contributed_to.length, 's')}} au{{$ctrl.pluriel($ctrl.contributed_to.length, 'x')}}quel{{$ctrl.pluriel($ctrl.contributed_to.length, 's')}} j'ai contribu\u00E9.</h4>\n              </label>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-md-12\">\n              <input class=\"form-control input-lg\"\n                     style=\"display: inline; background-color: rgba(240, 240, 240, 0.66);\"\n                     type=\"text\" name=\"search\"\n                     ng:model=\"$ctrl.filters.text\" />\n              <button class=\"btn btn-xs\" style=\"color: green; margin-left: -44px; margin-top: -4px;\" ng:click=\"$ctrl.filters.text = ''\">\n                <span class=\"glyphicon glyphicon-remove\"></span>\n              </button>\n            </div>\n          </div>\n\n          <div class=\"row\" style=\"margin-top: 14px;\">\n            <div class=\"col-md-6\">\n              <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                  Filtrage par classe\n\n                  <button class=\"btn btn-xs pull-right\" style=\"color: green;\"\n                          ng:click=\"$ctrl.clear_filters('groups')\">\n                    <span class=\"glyphicon glyphicon-remove\">\n                    </span>\n                  </button>\n                  <div class=\"clearfix\"></div>\n                </div>\n\n                <div class=\"panel-body\">\n                  <div class=\"btn-group\">\n                    <button class=\"btn btn-sm\" style=\"margin: 2px; font-weight: bold; color: #fff;\"\n                            ng:repeat=\"group in $ctrl.groups | orderBy:['name']\"\n                            ng:class=\"{'vert-moins': group.selected, 'vert-plus': !group.selected}\"\n                            ng:model=\"group.selected\"\n                            uib:btn-checkbox>\n                      {{group.name}}\n                    </button>\n                  </div>\n                </div>\n              </div>\n            </div>\n\n            <div class=\"col-md-6\">\n              <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                  Filtrage par niveau\n\n                  <button class=\"btn btn-xs pull-right\" style=\"color: green;\"\n                          ng:click=\"$ctrl.clear_filters('grades')\">\n                    <span class=\"glyphicon glyphicon-remove\">\n                    </span>\n                  </button>\n                  <div class=\"clearfix\"></div>\n                </div>\n\n                <div class=\"panel-body\">\n                  <div class=\"btn-group\">\n                    <button class=\"btn btn-sm\" style=\"margin: 2px; font-weight: bold; color: #fff;\"\n                            ng:repeat=\"grade in $ctrl.grades | orderBy:['name']\"\n                            ng:class=\"{'vert-moins': grade.selected, 'vert-plus': !grade.selected}\"\n                            ng:model=\"grade.selected\"\n                            uib:btn-checkbox>\n                      {{grade.name}}\n                    </button>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n        </div>\n      </div>\n\n    </div>\n  </div>\n</div>\n\n<div class=\"col-md-8 vert-moins damier trombinoscope\">\n  <ul>\n    <li class=\"col-xs-6 col-sm-4 col-md-3 col-lg-2 petite case vert-moins\"\n        style=\"background-repeat: no-repeat; background-attachment: scroll; background-clip: border-box; background-origin: padding-box; background-position-x: center; background-position-y: center; background-size: 100% auto;\"\n        ng:class=\"{'contributed': eleve.contributed}\"\n        ng:style=\"{'background-image': 'url( {{eleve.avatar}} )' }\"\n        ng:repeat=\"eleve in $ctrl.filtered = ( $ctrl.eleves | filter:$ctrl.apply_filters() | orderBy:['regroupement.name', 'lastname'] )\">\n      <a class=\"eleve\"\n         ui:sref=\"carnet({uid_eleve: eleve.id})\">\n        <h5 class=\"regroupement\">{{eleve.regroupement.name}}</h5>\n\n        <div class=\"full-name\" title=\"{{eleve.contributed ? 'Vous avez contribut\u00E9 \u00E0 ce carnet' : ''}}\">\n          <h4 class=\"first-name\">{{eleve.firstname}}</h4>\n          <h3 class=\"last-name\">{{eleve.lastname}}</h3>\n        </div>\n      </a>\n    </li>\n  </ul>\n</div>\n"
});
angular.module('suiviApp')
    .component('userDetails', {
    bindings: {
        uid: '<',
        small: '<',
        showAvatar: '<',
        showConcernedPeople: '<',
        showPhones: '<',
        showEmails: '<',
        showClasse: '<',
        showAddress: '<',
        showBirthdate: '<'
    },
    controller: ['APIs', 'URL_ENT',
        function (APIs, URL_ENT) {
            var ctrl = this;
            ctrl.URL_ENT = URL_ENT;
            ctrl.$onInit = function () {
                APIs.get_user(ctrl.uid)
                    .then(function success(response) {
                    ctrl.user = response.data;
                    if (ctrl.showClasse) {
                        ctrl.user.get_actual_groups()
                            .then(function (response) {
                            ctrl.user.actual_groups = response;
                            _(ctrl.user.actual_groups).each(function (group) {
                                APIs.get_structure(group.structure_id)
                                    .then(function (response) {
                                    group.structure = response.data;
                                });
                            });
                        });
                    }
                }, function error(response) { });
                if (ctrl.showConcernedPeople) {
                    APIs.query_people_concerned_about(ctrl.uid)
                        .then(function success(response) {
                        ctrl.concerned_people = _(response).groupBy('type');
                        delete ctrl.concerned_people['Élève'];
                    }, function error(response) { });
                }
            };
        }],
    template: "\n      <div class=\"col-md-12\">\n        <div class=\"avatar-container gris4 pull-left\" ng:style=\"{'height': $ctrl.small ? '44px' : '175px', 'width': $ctrl.small ? '44px' : '175px'}\">\n          <img class=\"avatar noir-moins\"\n               ng:style=\"{'max-height': $ctrl.small ? '44px' : '175px', 'max-width': $ctrl.small ? '44px' : '175px'}\"\n               ng:src=\"{{$ctrl.URL_ENT + '/' + $ctrl.user.avatar}}\"\n               ng:if=\"$ctrl.showAvatar\" />\n        </div>\n        <div class=\"col-md-8 details\">\n          <div class=\"col-md-12\">\n            <span class=\"first-name\"\n                  ng:style=\"{'font-size': $ctrl.small ? '100%' : '150%'}\"> {{$ctrl.user.firstname}}\n            </span>\n            <span class=\"last-name\"\n                  ng:style=\"{'font-size': $ctrl.small ? '100%' : '175%'}\"> {{$ctrl.user.lastname}}\n            </span>\n          </div>\n\n          <span class=\"col-md-12 classe\" ng:if=\"$ctrl.showClasse\">\n            <span ng:repeat=\"group in $ctrl.user.actual_groups | filter:{type: 'CLS'}\">\n              {{group.name}} - {{group.structure.name}}\n            </span>\n          </span>\n\n          <span class=\"col-md-12 birthdate\" ng:if=\"$ctrl.showBirthdate\">\n            n\u00E9<span ng:if=\"$ctrl.user.gender === 'F'\">e</span> le {{$ctrl.user.birthdate | date}}\n          </span>\n          <div class=\"col-md-12 email\"\n               ng:repeat=\"email in $ctrl.user.emails\"\n               ng:if=\"$ctrl.showEmails\">\n            <span class=\"glyphicon glyphicon-envelope\">\n            </span>\n            <a href=\"mailto:{{email.address}}\">{{email.address}}</a>\n          </div>\n          <span class=\"col-md-12 address\"\n                ng:if=\"$ctrl.showAddress && $ctrl.user.adresse\">\n            <span class=\"glyphicon glyphicon-home\">\n            </span>\n            <span style=\"display: inline-table;\">\n              {{$ctrl.user.address}}\n              <br>\n                {{$ctrl.user.zipcode}} {{$ctrl.user.city}}\n              </span>\n            </span>\n            <div class=\"col-md-12 phone\"\n                 ng:repeat=\"phone in $ctrl.user.phones\"\n                 ng:if=\"$ctrl.showPhones\">\n              <span class=\"glyphicon\"\n                    ng:class=\"{'glyphicon-phone': phone.type === 'PORTABLE', 'glyphicon-phone-alt': phone.type !== 'PORTABLE'}\">\n                {{phone.type}}: {{phone.number}}\n              </span>\n            </div>\n          </div>\n        </div>\n\n        <fieldset class=\"pull-left col-md-12 parents\" ng:if=\"$ctrl.showConcernedPeople\">\n          <legend>Personnes concern\u00E9es</legend>\n          <uib-accordion>\n            <div uib-accordion-group\n            class=\"panel-default\"\n            ng:repeat=\"(type, peoples) in $ctrl.concerned_people\"\n            ng:if=\"type != 'Autre \u00E9l\u00E8ve suivi'\">\n            <uib-accordion-heading>\n              <span class=\"glyphicon\" ng:class=\"{'glyphicon-menu-down': type.is_open, 'glyphicon-menu-right': !type.is_open}\">\n                </span> {{type}}\n            </uib-accordion-heading>\n            <ul>\n              <li ng:repeat=\"people in peoples | orderBy:'lastname'\">\n                <span ng:if=\"!people.contributed_to\">{{people.firstname}} {{people.lastname}}</span>\n                <span ng:if=\"people.contributed_to\">\n                  <a ui:sref=\"carnet({uid_eleve: people.id})\">{{people.firstname}} {{people.lastname}}</a>\n                </span>\n                <span ng:if=\"people.prof_principal\"> (enseignant principal)</span>\n                <span ng:if=\"people.actual_subjects\">\n                  <br/>\n                  <em ng:repeat=\"subject in people.actual_subjects\">\n                    <span class=\"glyphicon glyphicon-briefcase\">\n                      </span> {{subject.name}}\n                  </em>\n                </span>\n                <span ng:if=\"people.emails.length > 0\">\n                  <br/>\n                  <span class=\"glyphicon glyphicon-envelope\">\n                  </span>\n                  <a href=\"mailto:{{people.emails[0].address}}\">{{people.emails[0].address}}</a>\n                </span>\n              </li>\n            </ul>\n          </div>\n        </uib-accordion>\n      </fieldset>\n"
});
angular.module('suiviApp')
    .factory('Carnets', ['$resource', 'APP_PATH',
    function ($resource, APP_PATH) {
        return $resource(APP_PATH + "/api/carnets/:uid_eleve", { uid_eleve: '@uid_eleve' }, { update: { method: 'PUT' } });
    }]);
angular.module('suiviApp')
    .factory('DroitsOnglets', ['$resource', 'APP_PATH',
    function ($resource, APP_PATH) {
        return $resource(APP_PATH + "/api/droits/:id", {
            onglet_id: '@onglet_id',
            onglets_ids: '@onglets_ids',
            id: '@id',
            uid: '@uid',
            profil_id: '@profil_id',
            sharable_id: '@sharable_id',
            read: '@read',
            write: '@write',
            manage: '@manage'
        }, {
            update: { method: 'PUT' }
        });
    }]);
angular.module('suiviApp')
    .factory('Onglets', ['$resource', 'APP_PATH',
    function ($resource, APP_PATH) {
        return $resource(APP_PATH + "/api/onglets/:id", {
            uid: '@uid',
            uids: '@uids',
            id: '@id',
            nom: '@nom'
        }, {
            update: { method: 'PUT' }
        });
    }]);
angular.module('suiviApp')
    .factory('Saisies', ['$resource', 'APP_PATH',
    function ($resource, APP_PATH) {
        return $resource(APP_PATH + "/api/saisies/:id", {
            id: '@id',
            onglet_id: '@onglet_id',
            contenu: '@contenu'
        }, {
            update: { method: 'PUT' }
        });
    }]);
angular.module('suiviApp')
    .factory('User', ['$resource', '$rootScope', 'URL_ENT', 'UID',
    function ($resource, $rootScope, URL_ENT, UID) {
        return $resource(URL_ENT + "/api/users/" + UID, { expand: 'true' }, {
            get: {
                cache: false,
                transformResponse: function (response) {
                    var user = angular.fromJson(response);
                    user.profil_actif = _(user.profiles).findWhere({ active: true });
                    user.is_admin = function () {
                        return !_(user.profil_actif).isUndefined()
                            && !_.chain(user.profiles)
                                .findWhere({
                                structure_id: user.profil_actif.structure_id,
                                type: 'ADM'
                            })
                                .isUndefined()
                                .value();
                    };
                    return user;
                }
            }
        });
    }]);
angular.module('suiviApp')
    .service('APIs', ['$http', '$q', 'User', 'Onglets', 'URL_ENT', 'APP_PATH',
    function ($http, $q, User, Onglets, URL_ENT, APP_PATH) {
        var APIs = this;
        APIs.query_profiles_types = _.memoize(function () {
            return $http.get(URL_ENT + "/api/profiles_types");
        });
        APIs.get_user = _.memoize(function (user_id) {
            return $http.get(URL_ENT + "/api/users/" + user_id)
                .then(function (response) {
                response.data.profil_actif = _(response.data.profiles).findWhere({ active: true });
                if (_(response.data.profil_actif).isUndefined() && !_(response.data.profiles).isEmpty()) {
                    response.data.profil_actif = _(response.data.profiles).first();
                }
                response.data.get_actual_groups = function () {
                    return APIs.get_groups(_(response.data.groups).pluck('group_id'))
                        .then(function (groups) {
                        return $q.resolve(groups.data);
                    });
                };
                response.data.get_actual_subjects = function () {
                    return APIs.get_subjects(_(response.data.groups).pluck('subject_id'))
                        .then(function (subjects) {
                        return $q.resolve(subjects.data);
                    });
                };
                return response;
            });
        });
        APIs.get_current_user = _.memoize(function () {
            return User.get().$promise;
        });
        APIs.get_users = _.memoize(function (users_ids) {
            if (_(users_ids).isEmpty()) {
                return $q.resolve({ data: [] });
            }
            else {
                return $http.get(URL_ENT + "/api/users/", { params: { 'id[]': users_ids } });
            }
        });
        APIs.get_current_user_groups = _.memoize(function () {
            return APIs.get_current_user().then(function success(current_user) {
                var groups_ids = _.chain(current_user.groups).pluck('group_id').uniq().value();
                var promise = $q.resolve([]);
                if (_(['EVS', 'DIR', 'ADM']).contains(current_user.profil_actif.type) || current_user.profil_actif.admin) {
                    promise = APIs.get_groups_of_structures([current_user.profil_actif.structure_id]);
                }
                else {
                    promise = APIs.get_groups(groups_ids);
                }
                return promise
                    .then(function (groups) {
                    current_user.actual_groups = _(groups.data).select(function (group) {
                        return group.structure_id === current_user.profil_actif.structure_id;
                    });
                    return $q.resolve(current_user.actual_groups);
                });
            });
        });
        APIs.get_group = _.memoize(function (regroupement_id) {
            return $http.get(URL_ENT + "/api/groups/" + regroupement_id);
        });
        APIs.get_groups = _.memoize(function (groups_ids) {
            if (_(groups_ids).isEmpty()) {
                return $q.resolve({ data: [] });
            }
            else {
                return $http.get(URL_ENT + "/api/groups/", { params: { 'id[]': groups_ids } });
            }
        });
        APIs.get_groups_of_structures = _.memoize(function (structures_ids) {
            return $http.get(URL_ENT + "/api/groups/", { params: { 'structure_id[]': structures_ids } });
        });
        APIs.get_grades = _.memoize(function (grades_ids) {
            if (_(grades_ids).isEmpty()) {
                return $q.resolve({ data: [] });
            }
            else {
                return $http.get(URL_ENT + "/api/grades/", { params: { 'id[]': grades_ids } });
            }
        });
        APIs.get_subjects = _.memoize(function (subjects_ids) {
            if (_(subjects_ids).isEmpty()) {
                return $q.resolve({ data: [] });
            }
            else {
                return $http.get(URL_ENT + "/api/subjects/", { params: { 'id[]': subjects_ids } });
            }
        });
        APIs.query_carnets_contributed_to = function (uid) {
            return $http.get(APP_PATH + "/api/carnets/contributed/" + uid);
        };
        APIs.get_structure = _.memoize(function (uai) {
            return $http.get(URL_ENT + "/api/structures/" + uai);
        });
        APIs.query_common_onglets_of = function (uids) {
            return Onglets.query({ 'uids[]': uids }).$promise
                .then(function success(response) {
                return $q.resolve(_.chain(response)
                    .reject(function (i) { return _(i).isEmpty(); })
                    .map(function (i) { return _(i).toArray(); })
                    .flatten()
                    .groupBy('nom')
                    .toArray()
                    .select(function (tabgroup) {
                    return tabgroup.length == uids.length;
                })
                    .flatten()
                    .groupBy('nom')
                    .value());
            }, function error(response) { return $q.resolve({}); });
        };
        APIs.query_people_concerned_about = _.memoize(function (uid) {
            var eleve = null;
            var concerned_people = [];
            var profils = [];
            var contributed_to = [];
            var current_user = null;
            var users = [];
            var personnels = [];
            var pupils = [];
            var teachers = [];
            var main_teachers = [];
            return APIs.get_current_user()
                .then(function success(response) {
                current_user = response;
                return APIs.query_profiles_types();
            }, function error(response) { return $q.reject(response); })
                .then(function success(response) {
                profils = _(response.data).indexBy('id');
                return APIs.query_carnets_contributed_to(current_user.id);
            }, function error(response) { })
                .then(function success(response) {
                contributed_to = _(response.data).pluck('uid_eleve');
                if (!_(contributed_to).isEmpty()) {
                    APIs.get_users(contributed_to)
                        .then(function success(response) {
                        concerned_people.push(_(response.data).map(function (people) {
                            var pluriel = response.data.length > 1 ? 's' : '';
                            people.type = "Autre" + pluriel + " \u00E9l\u00E8ve" + pluriel + " suivi" + pluriel;
                            return people;
                        }));
                    }, function error(response) { return $q.reject(response); });
                }
                return APIs.get_user(uid);
            }, function error(response) { return $q.reject(response); })
                .then(function success(response) {
                eleve = response.data;
                eleve.type = 'Élève';
                concerned_people.push(eleve);
                if (!_(eleve.parents).isEmpty()) {
                    return APIs.get_users(_(eleve.parents).pluck('parent_id'));
                }
                else {
                    return $q.resolve({ no_parents: true });
                }
            }, function error(response) { return $q.reject(response); })
                .then(function success(response) {
                if (_(response).has('data')) {
                    concerned_people.push(_(response.data).map(function (people) {
                        var pluriel = response.data.length > 1 ? 's' : '';
                        people.type = "Responsable" + pluriel + " de l'\u00E9l\u00E8ve";
                        return people;
                    }));
                }
                if (!_(eleve.profil_actif).isUndefined()) {
                    return APIs.get_structure(eleve.profil_actif.structure_id);
                }
                else {
                    return $q.resolve({ no_profile: true });
                }
            }, function error(response) { return $q.reject(response); })
                .then(function success(response) {
                if (_(response).has('data')) {
                    personnels = _(response.data.profiles)
                        .reject(function (user) {
                        return _(['ELV', 'TUT', 'ENS']).contains(user.type);
                    });
                    return APIs.get_users(_(personnels).pluck('user_id'));
                }
                else {
                    return $q.resolve({ no_profile: true });
                }
            })
                .then(function success(response) {
                if (_(response).has('data')) {
                    personnels = _(personnels).indexBy('user_id');
                    concerned_people.push(_(response.data).map(function (people) {
                        people.type = profils[personnels[people.id].type].name + " de l'\u00E9l\u00E8ve";
                        return people;
                    }));
                    var groups_ids = _(eleve.groups).pluck('group_id');
                    return APIs.get_groups(groups_ids);
                }
                else {
                    return $q.resolve({ no_profile: true });
                }
            }, function error(response) { return $q.reject(response); })
                .then(function success(response) {
                if (_(response).has('data')) {
                    users = _.chain(response.data).pluck('users').flatten().value();
                    pupils = _(users).where({ type: 'ELV' });
                    if (pupils.length > 0) {
                        return APIs.get_users(_(pupils).pluck('user_id'));
                    }
                    else {
                        return $q.resolve({ no_pupils: true });
                    }
                }
                else {
                    return $q.resolve({ no_profile: true });
                }
            }, function error(response) { return $q.reject(response); })
                .then(function success(response) {
                pupils = _(pupils).indexBy('user_id');
                concerned_people.push(_(response.data).map(function (people) {
                    var pluriel = response.data.length > 1 ? 's' : '';
                    people.type = "Autre" + pluriel + " \u00E9l\u00E8ve" + pluriel;
                    return people;
                }));
                teachers = _(users).where({ type: 'ENS' });
                if (teachers.length > 0) {
                    return APIs.get_users(_(teachers).pluck('user_id'));
                }
                else {
                }
                return $q.resolve();
            }, function error(response) { return $q.reject(response); })
                .then(function success(response) {
                teachers = _(teachers).indexBy('user_id');
                main_teachers = _(users).where({ type: 'PRI' });
                concerned_people.push(_(response.data).map(function (people) {
                    people.type = profils[teachers[people.id].type].name + " de l'\u00E9l\u00E8ve";
                    APIs.get_subjects(_(people.groups).pluck('subject_id'))
                        .then(function (response) {
                        people.actual_subjects = response.data;
                    });
                    return people;
                }));
                return $q.resolve();
            }, function error(response) { return $q.reject(response); })
                .then(function () {
                return $q.resolve(_.chain(concerned_people)
                    .flatten()
                    .uniq(function (people) {
                    return people.id;
                })
                    .value());
            });
        });
    }]);
angular.module('suiviApp')
    .service('Popups', ['$uibModal', '$q', 'Onglets', 'DroitsOnglets', 'Saisies', 'APIs', 'UID',
    function ($uibModal, $q, Onglets, DroitsOnglets, Saisies, APIs, UID) {
        var service = this;
        var template_onglet = "\n<div class=\"modal-header\">\n  <h3 class=\"modal-title\">\n    Propri\u00E9t\u00E9s de l'onglet\n  </h3>\n</div>\n\n<div class=\"modal-body\">\n  <label>Titre : <input type=\"text\" maxlength=\"45\" ng:model=\"$ctrl.onglet.nom\" ng:maxlength=\"45\" ng:change=\"$ctrl.onglet.dirty = true; $ctrl.name_validation()\" />\n    <span class=\"label label-danger\" ng:if=\"!$ctrl.valid_name\">Un onglet existant porte d\u00E9j\u00E0 ce nom !</span>\n  </label>\n\n  <span class=\"label label-info\" ng:if=\"$ctrl.uids\">L'\u00E9l\u00E8ve aura un acc\u00E8s en lecture/\u00E9criture \u00E0 cet onglet.</span>\n  <droits-onglets droits=\"$ctrl.droits\"\n                  concerned-people=\"$ctrl.concerned_people\"\n                  ng:if=\"$ctrl.droits\"></droits-onglets>\n\n  <div class=\"clearfix\"></div>\n</div>\n\n<div class=\"modal-footer\">\n  <button class=\"btn btn-danger pull-left\"\n          ng:click=\"$ctrl.delete()\"\n          ng:if=\"$ctrl.onglet.id\">\n    <span class=\"glyphicon glyphicon-trash\"></span>\n    <span> Supprimer l'onglet</span>\n  </button>\n  <button class=\"btn btn-default\"\n          ng:click=\"$ctrl.cancel()\">\n    <span class=\"glyphicon glyphicon-remove-sign\"></span>\n    <span ng:if=\"$ctrl.onglet.nom\"> Annuler</span>\n    <span ng:if=\"!$ctrl.onglet.nom\"> Fermer</span>\n  </button>\n  <button class=\"btn btn-success\"\n          ng:click=\"$ctrl.ok()\"\n          ng:disabled=\"!$ctrl.onglet.nom || !$ctrl.valid_name\">\n    <span class=\"glyphicon glyphicon-ok-sign\"></span> Valider\n  </button>\n</div>\n";
        service.onglet = function (uid, onglet, all_onglets, callback) {
            $uibModal.open({
                resolve: {
                    uid: function () { return uid; },
                    onglet: function () { return _(onglet).isNull() ? { nom: '' } : onglet; },
                    all_onglets: function () { return all_onglets; }
                },
                controller: ['$scope', '$uibModalInstance', '$q', 'DroitsOnglets', 'APIs', 'URL_ENT', 'DEFAULT_RIGHTS_ONGLET', 'UID', 'uid', 'onglet', 'all_onglets',
                    function PopupOngletCtrl($scope, $uibModalInstance, $q, DroitsOnglets, APIs, URL_ENT, DEFAULT_RIGHTS_ONGLET, UID, uid, onglet, all_onglets) {
                        var ctrl = $scope;
                        ctrl.$ctrl = ctrl;
                        ctrl.uid = uid;
                        ctrl.onglet = onglet;
                        ctrl.all_onglets = all_onglets;
                        ctrl.onglet.delete = false;
                        ctrl.valid_name = true;
                        if (_(ctrl.onglet).has('id')) {
                            DroitsOnglets.query({
                                onglet_id: ctrl.onglet.id
                            }).$promise
                                .then(function success(response) {
                                ctrl.droits = _(response).map(function (droit) {
                                    droit.own = droit.uid == uid;
                                    return new DroitsOnglets(droit);
                                });
                            }, function error(response) { });
                        }
                        else {
                            ctrl.droits = [new DroitsOnglets({ uid: UID, read: true, write: true, manage: true })];
                            ctrl.droits.push(new DroitsOnglets({ uid: uid, read: true, write: true, manage: false }));
                            ctrl.droits = ctrl.droits.concat(_(DEFAULT_RIGHTS_ONGLET)
                                .map(function (droit) {
                                var proper_droit = new DroitsOnglets(droit);
                                proper_droit.dirty = { profil_id: true, read: true, write: true, manage: true };
                                return proper_droit;
                            }));
                        }
                        APIs.get_user(uid)
                            .then(function success(response) {
                            ctrl.eleve = response.data;
                        }, function error(response) { });
                        APIs.query_people_concerned_about(uid)
                            .then(function success(response) {
                            ctrl.concerned_people = response;
                        }, function error(response) { });
                        ctrl.name_validation = function () {
                            var other_onglets_names = _.chain(ctrl.all_onglets)
                                .reject(function (onglet) {
                                return !_(ctrl.onglet).isNull() && ctrl.onglet.id == onglet.id;
                            })
                                .pluck('nom')
                                .value();
                            ctrl.valid_name = !_(other_onglets_names).includes(ctrl.onglet.nom);
                            return ctrl.valid_name;
                        };
                        ctrl.ok = function () {
                            $uibModalInstance.close({
                                onglet: ctrl.onglet,
                                droits: ctrl.droits
                            });
                        };
                        ctrl.delete = function () {
                            swal({
                                title: 'Êtes-vous sur ?',
                                text: "L'onglet ainsi que toutes les saisies et droits associés seront définitivement supprimés !",
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Oui, je confirme !',
                                cancelButtonColor: '#d33',
                                cancelButtonText: 'Annuler'
                            })
                                .then(function () {
                                ctrl.onglet.delete = true;
                                ctrl.ok();
                            });
                        };
                        ctrl.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }],
                template: template_onglet
            })
                .result.then(function success(response_popup) {
                var promise = null;
                var action = 'rien';
                if (_(onglet).isNull()) {
                    action = 'created';
                    promise = new Onglets({
                        uid: uid,
                        nom: response_popup.onglet.nom
                    }).$save();
                }
                else {
                    if (response_popup.onglet.delete) {
                        action = 'deleted';
                        promise = new Onglets(response_popup.onglet).$delete();
                    }
                    else if (response_popup.onglet.dirty) {
                        promise = new Onglets(response_popup.onglet).$update();
                    }
                    else {
                        promise = $q.resolve(response_popup.onglet);
                    }
                }
                promise.then(function success(response) {
                    response.action = action;
                    if (action != 'deleted') {
                        _.chain(response_popup.droits)
                            .reject(function (droit) { return _(droit).has('uid') && (droit.uid == UID || droit.uid == uid); })
                            .each(function (droit) {
                            if (droit.to_delete) {
                                if (_(droit).has('id')) {
                                    droit.$delete();
                                }
                            }
                            else if (droit.dirty
                                && (droit.uid !== '...' && droit.profil_id !== '...' && droit.sharable_id !== '...')
                                && _(droit.dirty).reduce(function (memo, value) { return memo || value; }, false)
                                && droit.read) {
                                droit.onglet_id = response.id;
                                (_(droit).has('id') ? droit.$update() : droit.$save());
                            }
                        });
                    }
                    callback(response);
                }, function error() { });
            }, function error() { });
        };
        service.onglet_batch = function (uids, callback) {
            $uibModal.open({
                resolve: {
                    uids: function () { return uids; }
                },
                controller: ['$scope', '$uibModalInstance', '$q', 'DroitsOnglets', 'APIs', 'URL_ENT', 'DEFAULT_RIGHTS_ONGLET', 'UID', 'uids',
                    function PopupOngletCtrl($scope, $uibModalInstance, $q, DroitsOnglets, APIs, URL_ENT, DEFAULT_RIGHTS_ONGLET, UID, uids) {
                        var ctrl = $scope;
                        ctrl._ = _;
                        ctrl.$ctrl = ctrl;
                        ctrl.uids = uids;
                        ctrl.droits = [{ uid: UID, read: true, write: true, manage: true }];
                        ctrl.droits = ctrl.droits.concat(_(DEFAULT_RIGHTS_ONGLET)
                            .map(function (droit) {
                            var proper_droit = new DroitsOnglets(droit);
                            proper_droit.dirty = { profil_id: true, read: true, write: true, manage: true };
                            return proper_droit;
                        }));
                        APIs.query_common_onglets_of(ctrl.uids)
                            .then(function (response) {
                            ctrl.common_tabs = response;
                        });
                        var current_user = null;
                        var profils = {};
                        var personnels = [];
                        APIs.get_current_user()
                            .then(function success(response) {
                            current_user = response;
                            return APIs.query_profiles_types();
                        })
                            .then(function success(response) {
                            profils = _(response.data).indexBy('id');
                            return APIs.get_structure(current_user.profil_actif.structure_id);
                        }, function error(response) { return $q.reject(response); })
                            .then(function success(response) {
                            if (_(response).has('data')) {
                                personnels = _(response.data.profiles)
                                    .reject(function (user) {
                                    return _(['ELV', 'TUT']).contains(user.type);
                                });
                                return APIs.get_users(_(personnels).pluck('user_id'));
                            }
                        }, function error(response) { return $q.reject(response); })
                            .then(function success(response) {
                            if (_(response).has('data')) {
                                personnels = _(personnels).indexBy('user_id');
                                ctrl.concerned_people = _(response.data).map(function (people) {
                                    people.type = profils[personnels[people.id].type].name;
                                    return people;
                                });
                            }
                        }, function error(response) { return $q.reject(response); });
                        ctrl.valid_name = true;
                        ctrl.name_validation = function () {
                            var other_onglets_names = _(ctrl.common_tabs).keys();
                            ctrl.valid_name = !_(other_onglets_names).includes(ctrl.onglet.nom);
                            return ctrl.valid_name;
                        };
                        ctrl.ok = function () {
                            $uibModalInstance.close({
                                onglet: ctrl.onglet,
                                droits: ctrl.droits
                            });
                        };
                        ctrl.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }],
                template: template_onglet
            })
                .result.then(function success(response_popup) {
                var promises = null;
                var action = 'created';
                new Onglets({
                    uids: uids,
                    nom: response_popup.onglet.nom
                }).$save()
                    .then(function success(response) {
                    response.action = action;
                    var onglets_ids = _(response.data).pluck('id');
                    _.chain(response_popup.droits)
                        .reject(function (droit) { return _(droit).has('uid') && droit.uid == UID; })
                        .reject(function (droit) { return _(droit).has('to_delete') && droit.to_delete; })
                        .each(function (droit) {
                        droit.onglets_ids = onglets_ids;
                        new DroitsOnglets(droit).$save();
                    });
                    callback(response);
                }, function error(response) { console.log(response); });
            }, function error() { });
        };
        service.publish_batch = function (uids, callback) {
            $uibModal.open({
                template: "\n<div class=\"modal-header\">\n  <h3 class=\"modal-title\">\n    Pulication simultan\u00E9e vers un onglet commun \u00E0 plusieurs \u00E9l\u00E8ves\n  </h3>\n</div>\n\n<div class=\"modal-body\">\n  <div class=\"alert alert-warning\" role=\"alert\" ng:if=\"$ctrl.common_tabs && !$ctrl.has_common_tabs\">Aucun onglet commun n'a \u00E9t\u00E9 trouv\u00E9 pour cette s\u00E9lection d'\u00E9l\u00E8ves.</div>\n\n  <div ng:if=\"$ctrl.common_tabs && $ctrl.has_common_tabs\">\n    <label>Onglet(s) commun(s) existant(s) :</label>\n    <div class=\"btn-group\">\n      <label class=\"btn btn-primary\" ng-model=\"$ctrl.selected_onglets\" uib-btn-radio=\"tabs\"ng:repeat=\"(name, tabs) in $ctrl.common_tabs\">{{name}}</label>\n    </div>\n  </div>\n\n  <saisie class=\"col-md-12\"\n          style=\"display: inline-block;\"\n          passive=\"true\"\n          saisie=\"$ctrl.saisie\"\n          ng:if=\"$ctrl.common_tabs && $ctrl.has_common_tabs\"></saisie>\n\n  <div class=\"clearfix\"></div>\n</div>\n\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\"\n          ng:click=\"$ctrl.cancel()\">\n    <span class=\"glyphicon glyphicon-remove-sign\"></span> Annuler\n  </button>\n  <button class=\"btn btn-success\"\n          ng:click=\"$ctrl.ok()\"\n          ng:disabled=\"!$ctrl.selected_onglets || !$ctrl.saisie.contenu\">\n    <span class=\"glyphicon glyphicon-ok-sign\"></span> Valider\n  </button>\n</div>\n",
                resolve: {
                    uids: function () { return uids; }
                },
                controller: ['$scope', '$uibModalInstance', '$q', 'Saisies', 'APIs', 'uids',
                    function PopupOngletCtrl($scope, $uibModalInstance, $q, Saisies, APIs, uids) {
                        var ctrl = $scope;
                        ctrl.$ctrl = ctrl;
                        ctrl.uids = uids;
                        ctrl.saisie = { create_me: true };
                        APIs.query_common_onglets_of(ctrl.uids)
                            .then(function (response) {
                            ctrl.common_tabs = response;
                            ctrl.has_common_tabs = !_(ctrl.common_tabs).isEmpty();
                        });
                        ctrl.ok = function () {
                            $uibModalInstance.close({
                                saisie: ctrl.saisie,
                                onglets_ids: _(ctrl.selected_onglets).pluck('id')
                            });
                        };
                        ctrl.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
            })
                .result.then(function success(response_popup) {
                $q.all(_(response_popup.onglets_ids).map(function (onglet_id) {
                    return new Saisies({
                        contenu: response_popup.saisie.contenu,
                        onglet_id: onglet_id
                    }).$save();
                }))
                    .then(function (response) {
                    callback(response);
                });
            }, function error() { });
        };
    }]);
