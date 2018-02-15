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
            url: '/carnet/:uids',
            params: { uids: { array: true } },
            component: 'carnet',
            resolve: {
                uids: ['$transition$',
                    function ($transition$) {
                        return $transition$.params().uids;
                    }]
            }
        });
    }]);
angular.module('suiviApp')
    .component('carnet', {
    bindings: {
        uids: '<'
    },
    template: "\n               <div class=\"col-md-4 gris1-moins aside aside-carnet\">\n                 <a class=\"col-md-12 btn btn-lg noir-moins go-back\" ui:sref=\"trombinoscope()\"> \u21B0 Retour au trombinoscope </a>\n\n                 <user-details class=\"user-details eleve\"\n                               uid=\"$ctrl.uids[0]\"\n                               show-avatar=\"true\"\n                               show-emails=\"true\"\n                               show-classe=\"true\"\n                               show-birthdate=\"true\"\n                               show-address=\"true\"\n                               show-concerned-people=\"true\"\n                               ng:if=\"$ctrl.uids.length == 1\"></user-details>\n\n                 <ul ng:if=\"$ctrl.uids.length > 1\">\n                   <li style=\"list-style-type: none;\"\n                       ng:repeat=\"uid in $ctrl.uids\">\n                     <a class=\"eleve\"\n                        ui:sref=\"carnet({uids: [uid]})\">\n                       <user-details class=\"user-details eleve\"\n                                     uid=\"uid\"\n                                     small=\"true\"\n                                     show-avatar=\"true\"\n                                     show-classe=\"true\"></user-details>\n                     </a>\n                   </li>\n                 </ul>\n               </div>\n\n               <onglets class=\"col-md-8 carnet\"\n                        uids=\"$ctrl.uids\"></onglets>\n"
});
angular.module('suiviApp')
    .component('droits', {
    bindings: {
        uidEleve: '<',
        droits: '=',
        concernedPeople: '<'
    },
    controller: ['Droits', 'APIs', 'UID', 'URL_ENT', 'User',
        function (Droits, APIs, UID, URL_ENT, User) {
            var ctrl = this;
            ctrl.sharing_enabled = false;
            var gen_pseudo_UUID = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };
            ctrl.add = function (droit) {
                droit.new = true;
                droit.dirty = {
                    uid: false,
                    profil_id: false,
                    group_id: false,
                    sharable_id: false,
                    read: false,
                    write: false,
                    manage: false
                };
                ctrl.droits.push(new Droits(droit));
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
                        group_id: false,
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
                ctrl.droits.forEach(function (droit) {
                    droit.deletable = droit.uid != UID;
                    if (ctrl.uidEleve != undefined) {
                        droit.deletable = droit.deletable && droit.uid != ctrl.uidEleve;
                    }
                });
            };
            ctrl.$onInit = function () {
                ctrl.UID = UID;
                ctrl.update_deletabilities();
                APIs.query_profiles_types()
                    .then(function success(response) {
                    ctrl.profils = response.data;
                }, function error(response) { });
                User.get({ id: UID }).$promise
                    .then(function success(current_user) {
                    return current_user.get_actual_groups();
                })
                    .then(function success(response) {
                    ctrl.groups = response.filter(function (group) { return group.type == "GPL"; })
                        .map(function (group) {
                        var types = { CLS: "Classes", GRP: "Groupes d'élèves", GPL: "Groupes libres" };
                        group.type = types[group.type];
                        return group;
                    });
                }, function error(response) { });
            };
        }],
    template: "\n                            <div>\n                              <label>Gestion des droits</label>\n                              <table style=\"width: 100%;\">\n                                <tr style=\"text-align: right;\"\n                                    ng:repeat=\"droit in $ctrl.droits\"\n                                    ng:if=\"ctrl.sharing_enabled || !droit.sharable_id\">\n                                  <td>\n                                    <label ng:if=\"droit.uid\">Personne :\n                                      <select style=\"width: 250px;\"\n                                              ng:model=\"droit.uid\"\n                                              ng:change=\"droit.dirty.uid = true\"\n                                              ng:disabled=\"droit.to_delete\"\n                                              ng:options=\"people.id as people.firstname + ' ' + people.lastname group by people.type for people in $ctrl.concernedPeople\">\n                                      </select>\n                                    </label>\n\n                                    <label ng:if=\"droit.profil_id\">Profil :\n                                      <select style=\"width: 250px;\"\n                                              ng:model=\"droit.profil_id\"\n                                              ng:change=\"droit.dirty.profil_id = true\"\n                                              ng:disabled=\"droit.to_delete\">\n                                        <option ng:repeat=\"profil in $ctrl.profils track by profil.id\"\n                                                ng:value=\"profil.id\">{{profil.name}}</option>\n                                      </select>\n                                    </label>\n\n                                    <label ng:if=\"droit.group_id\">Groupe :\n                                      <select style=\"width: 250px;\"\n                                              ng:model=\"droit.group_id\"\n                                              ng:change=\"droit.dirty.group_id = true\"\n                                              ng:disabled=\"droit.to_delete\"\n                                              ng:options=\"group.id as group.name group by group.type for group in $ctrl.groups\">\n                                      </select>\n                                    </label>\n\n                                    <label ng:if=\"droit.sharable_id\">Partage :\n                                      <input style=\"width: 250px;\"\n                                             type=\"text\"\n                                             ng:model=\"droit.sharable_id\"\n                                             ng:change=\"droit.dirty.sharable_id = true\"\n                                             ng:disabled=\"droit.to_delete\" />\n                                    </label>\n                                  </td>\n                                  <td>\n                                    <button type=\"button\" class=\"btn\"\n                                            ng:class=\"{'btn-default': !droit.read, 'btn-success': droit.read}\"\n                                            ng:model=\"droit.read\"\n                                            ng:change=\"$ctrl.set_read( droit )\"\n                                            ng:disabled=\"droit.to_delete || droit.sharable_id\"\n                                            uib:btn-checkbox\n                                            btn-checkbox-true=\"true\"\n                                            btn-checkbox-false=\"false\"\n                                            uib:tooltip=\"droit de lecture\">\n                                      <span class=\"glyphicon glyphicon-eye-open\"></span>\n                                    </button>\n                                  </td>\n                                  <td>\n                                    <button type=\"button\" class=\"btn\"\n                                            ng:class=\"{'btn-default': !droit.write, 'btn-success': droit.write}\"\n                                            ng:model=\"droit.write\"\n                                            ng:change=\"$ctrl.set_write( droit )\"\n                                            ng:disabled=\"droit.to_delete || droit.sharable_id\"\n                                            uib:btn-checkbox\n                                            btn-checkbox-true=\"true\"\n                                            btn-checkbox-false=\"false\"\n                                            uib:tooltip=\"droit d'\u00E9criture\">\n                                      <span class=\"glyphicon glyphicon-edit\"></span>\n                                    </button>\n                                  </td>\n                                  <td>\n                                    <button type=\"button\" class=\"btn\"\n                                            ng:class=\"{'btn-default': !droit.manage, 'btn-success': droit.manage}\"\n                                            ng:model=\"droit.manage\"\n                                            ng:change=\"$ctrl.set_manage( droit )\"\n                                            ng:disabled=\"droit.to_delete || droit.sharable_id\"\n                                            uib:btn-checkbox\n                                            btn-checkbox-true=\"true\"\n                                            btn-checkbox-false=\"false\"\n                                            uib:tooltip=\"droit d'administration\">\n                                      <span class=\"glyphicon glyphicon-cog\"></span>\n                                    </button>\n                                  </td>\n                                  <td>\n                                    <button type=\"button\" class=\"btn\"\n                                            ng:class=\"{'btn-default': !droit.to_delete, 'btn-warning': droit.to_delete}\"\n                                            ng:disabled=\"!droit.deletable && !droit.to_delete\"\n                                            ng:model=\"droit.to_delete\"\n                                            ng:change=\"$ctrl.update_deletabilities()\"\n                                            uib:btn-checkbox\n                                            btn-checkbox-true=\"true\"\n                                            btn-checkbox-false=\"false\">\n                                      <span class=\"glyphicon glyphicon-trash\"></span>\n                                    </button>\n                                  </td>\n                                </tr>\n                                <tfoot>\n                                  <td colspan=\"3\">\n                                    <button class=\"btn btn-default\"\n                                            ng:click=\"$ctrl.add({ uid: '...', read: true, write: true })\">\n                                      <span class=\"glyphicon glyphicon-plus-sign\"></span> par personne\n                                    </button>\n\n                                    <button class=\"btn btn-default\"\n                                            ng:click=\"$ctrl.add({ profil_id: '...', read: true, write: false })\">\n                                      <span class=\"glyphicon glyphicon-plus-sign\"></span> par profil\n                                    </button>\n\n                                    <button class=\"btn btn-default\"\n                                            ng:click=\"$ctrl.add({ group_id: '...', read: true, write: false })\"\n                                            ng:if=\"$ctrl.groups.length > 0\">\n                                      <span class=\"glyphicon glyphicon-plus-sign\"></span> par groupe\n                                    </button>\n\n                                    <button class=\"btn btn-warning pull-right\"\n                                            ng:if=\"ctrl.sharing_enabled\"\n                                            ng:click=\"$ctrl.add_sharable({ read: true, write: false })\">\n                                      <span class=\"glyphicon glyphicon-plus-sign\"></span> partage\n                                    </button>\n                                  </td>\n                                </tfoot>\n                              </table>\n                            </div>\n"
});
angular.module('suiviApp')
    .config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|blob|data):/);
    }])
    .component('onglet', {
    bindings: {
        uids: '<',
        onglets: '<',
        onglet: '='
    },
    controller: ['$uibModal', '$state', '$q', '$window', '$sce', '$location', 'Saisies',
        function ($uibModal, $state, $q, $window, $sce, $location, Saisies) {
            var ctrl = this;
            ctrl.order_by = {
                field: 'date',
                reverse: true
            };
            ctrl.callback_popup_onglet = function (onglet) {
                if (onglet.action == 'deleted') {
                    $state.go('carnet', { uids: ctrl.uids }, { reload: true });
                }
            };
            ctrl.saisie_callback = function (saisie) {
                switch (saisie.action) {
                    case 'created':
                        ctrl.saisies.push(saisie);
                        init_new_saisie();
                        break;
                    case 'deleted':
                        ctrl.saisies = ctrl.saisies.filter(function (s) { return s.id != saisie.id; });
                        break;
                    case 'updated':
                        var index = ctrl.saisies.findIndex(function (s) { return s.id == saisie.id; });
                        ctrl.saisies[index] = saisie;
                        break;
                    default:
                        console.log('What to do with this?');
                        console.log(saisie);
                }
            };
            var init_new_saisie = function () {
                ctrl.new_saisie = ctrl.onglet.writable ? { create_me: true } : null;
            };
            var filter_on_pin = function (pinned) {
                return function () {
                    return function (saisie) {
                        return saisie.pinned == pinned;
                    };
                };
            };
            ctrl.filter_pinned = filter_on_pin(true);
            ctrl.filter_unpinned = filter_on_pin(false);
            ctrl.$onInit = function () {
                init_new_saisie();
                Saisies.query({
                    "onglets_ids[]": ctrl.onglet.ids
                }).$promise
                    .then(function success(response) {
                    ctrl.saisies = response;
                }, function error(response) { });
            };
        }],
    template: "\n                  <saisie class=\"col-md-12\" style=\"display: inline-block;\"\n                          ng:repeat=\"saisie in $ctrl.saisies | filter:$ctrl.filter_pinned() | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse\"\n                          onglet=\"$ctrl.onglet\"\n                          saisie=\"saisie\"\n                          callback=\"$ctrl.saisie_callback( saisie )\"></saisie>\n\n                  <saisie class=\"col-md-12\"\n                          style=\"display: inline-block;\"\n                          ng:if=\"$ctrl.new_saisie\"\n                          onglet=\"$ctrl.onglet\"\n                          saisie=\"$ctrl.new_saisie\"\n                          callback=\"$ctrl.saisie_callback( $ctrl.new_saisie )\"></saisie>\n\n                  <div class=\"col-md-12\" style=\"margin-bottom: 10px;\">\n                    <button class=\"btn btn-sm btn-primary pull-right\"\n                            ng:click=\"$ctrl.order_by.reverse = !$ctrl.order_by.reverse\"\n                            ng:if=\"$ctrl.saisies.length > 1\">\n                      <span class=\"glyphicon\"\n                            ng:class=\"{'glyphicon-sort-by-order': $ctrl.order_by.reverse, 'glyphicon-sort-by-order-alt': !$ctrl.order_by.reverse}\"></span>\n                      Trier par la date de publication la plus <span ng:if=\"$ctrl.order_by.reverse\">r\u00E9cente</span><span ng:if=\"!$ctrl.order_by.reverse\">ancienne</span>.\n                    </button>\n                  </div>\n\n                  <div class=\"col-md-12 saisies\" style=\"overflow-y: auto;\">\n\n                    <saisie class=\"col-md-12\" style=\"display: inline-block;\"\n                            ng:repeat=\"saisie in $ctrl.saisies | filter:$ctrl.filter_unpinned() | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse\"\n                            onglet=\"$ctrl.onglet\"\n                            saisie=\"saisie\"\n                            callback=\"$ctrl.saisie_callback( saisie )\"></saisie>\n                  </div>\n"
});
angular.module('suiviApp')
    .component('onglets', {
    bindings: {
        uids: '<'
    },
    controller: ['$uibModal', 'Onglets', 'Popups', 'APIs', 'User', 'UID',
        function ($uibModal, Onglets, Popups, APIs, User, UID) {
            var ctrl = this;
            ctrl.popup_onglet = Popups.onglet;
            ctrl.callback_popup_onglet = function (onglets) {
                if (onglets[0].created) {
                    var new_onglet = onglets[0];
                    new_onglet.ids = onglets.map(function (onglet) { return onglet.id; });
                    ctrl.onglets.push(new_onglet);
                }
                if (onglets[0].deleted) {
                    ctrl.onglets = ctrl.onglets.filter(function (onglet) { return onglet.nom != onglets[0].nom; });
                }
            };
            ctrl.$onInit = function () {
                if (ctrl.uids.length == 1) {
                    Popups.loading_window("Chargement des onglets", "", function () {
                        return Onglets.query({ "uids[]": ctrl.uids }).$promise
                            .then(function success(response) {
                            ctrl.onglets = _(response[0]).map(function (onglet) {
                                onglet.ids = [onglet.id];
                                return onglet;
                            });
                        }, function error(response) { });
                    });
                }
                else {
                    Popups.loading_window("Chargement des onglets communs", "", function () {
                        return APIs.query_common_onglets_of(ctrl.uids)
                            .then(function (response) {
                            ctrl.onglets = Object.keys(response).map(function (key) {
                                return {
                                    nom: key,
                                    ids: response[key].map(function (onglet) { return onglet.id; }),
                                    writable: response[key].reduce(function (memo, onglet) { return memo && onglet.writable; }, true),
                                    manageable: response[key].reduce(function (memo, onglet) { return memo && onglet.manageable; }, true)
                                };
                            });
                        });
                    });
                }
                User.get({ id: UID }).$promise
                    .then(function (response) {
                    ctrl.current_user = response;
                    ctrl.can_add_tab = ctrl.current_user.can_add_tab(ctrl.uids);
                });
            };
        }],
    template: "\n  <style>\n    .manage-onglet { margin-top: -11px; margin-right: -16px; border-radius: 0 0 0 12px; }\n  </style>\n  <uib-tabset>\n    <uib-tab ng:repeat=\"onglet in $ctrl.onglets\">\n      <uib-tab-heading> {{onglet.nom}}\n        <button class=\"btn btn-warning manage-onglet\"\n                ng:if=\"onglet.manageable\"\n                ng:click=\"$ctrl.popup_onglet( $ctrl.uids, onglet, $ctrl.onglets, $ctrl.callback_popup_onglet )\">\n          <span class=\"glyphicon glyphicon-cog\"></span>\n        </button>\n      </uib-tab-heading>\n\n      <onglet uids=\"$ctrl.uids\"\n              onglets=\"$ctrl.onglets\"\n              onglet=\"onglet\">\n      </onglet>\n    </uib-tab>\n\n    <li>\n      <a href\n         class=\"bleu add-onglet\"\n         ng:click=\"$ctrl.popup_onglet( $ctrl.uids, null, $ctrl.onglets, $ctrl.callback_popup_onglet )\"\n         ng:if=\"$ctrl.can_add_tab\">\n        <span class=\"glyphicon glyphicon-plus\">\n        </span>\n      </a>\n    </li>\n  </uib-tabset>\n"
});
angular.module('suiviApp')
    .component('saisie', {
    bindings: {
        onglet: '<',
        saisie: '=',
        callback: '&'
    },
    controller: ['$sce', 'Saisies', 'APIs', 'User', 'UID',
        function ($sce, Saisies, APIs, User, UID) {
            var ctrl = this;
            ctrl.toggle_edit = function () {
                ctrl.edition = !ctrl.edition;
                if (!ctrl.edition) {
                    ctrl.saisie.trusted_contenu = $sce.trustAsHtml(ctrl.saisie.contenu);
                }
                else {
                    ctrl.previous_content = ctrl.saisie.contenu;
                }
            };
            ctrl.cancel = function () {
                ctrl.saisie.contenu = ctrl.previous_content;
                ctrl.toggle_edit();
            };
            ctrl.save = function () {
                ctrl.saisie.pinned = ctrl.saisie.tmp_pinned || false;
                if (!_(ctrl.saisie).has('$save')) {
                    ctrl.saisie.onglets_ids = ctrl.onglet.ids;
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
                    cancelButtonText: 'Annuler'
                })
                    .then(function () {
                    Saisies.delete({
                        id: ctrl.saisie.id,
                        "onglets_ids[]": ctrl.onglet.ids
                    }).$promise
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
                    ctrl.saisie.tmp_pinned = false;
                }
                else {
                    ctrl.saisie = new Saisies(ctrl.saisie);
                    ctrl.saisie.tmp_pinned = ctrl.saisie.pinned;
                }
                ctrl.saisie.trusted_contenu = $sce.trustAsHtml(ctrl.saisie.contenu);
                User.get({ id: UID }).$promise
                    .then(function (current_user) {
                    ctrl.current_user = current_user;
                    ctrl.editable = ctrl.new_saisie ||
                        (_(ctrl).has('onglet') && ctrl.onglet.writable && ctrl.saisie.uid_author == ctrl.current_user.id) ||
                        ctrl.current_user.is_admin();
                });
                ctrl.toolbar_id = ctrl.new_saisie ? (Math.random() * 2048) + "" : ctrl.saisie.id;
            };
            ctrl.$onChanges = function (changes) {
                ctrl.saisie.trusted_contenu = $sce.trustAsHtml(ctrl.saisie.contenu);
            };
        }],
    template: "\n                 <div class=\"panel panel-default saisie-display\" ng:class=\"{'new-saisie': $ctrl.new_saisie}\">\n                   <span style=\"position: absolute; top: 0; right: 15px;height: 0;width: 0;text-align: center; color: #fff; border-color: transparent #fa0 transparent transparent;border-style: solid;border-width: 0 50px 50px 0; z-index: 1;\"\n                         ng:if=\"$ctrl.saisie.tmp_pinned\">\n                     <span class=\"glyphicon glyphicon-pushpin\" style=\"margin-left: 25px;font-size: 22px;margin-top: 3px;\"></span>\n                   </span>\n\n                   <div class=\"panel-heading\" ng:if=\"$ctrl.saisie.id && !$ctrl.saisie.tmp_pinned\">\n                     <user-details class=\"col-md-4\"\n                                   ng:if=\"!$ctrl.saisie.new_saisie\"\n                                   uid=\"$ctrl.saisie.uid_author\"\n                                   small=\"true\"\n                                   show-avatar=\"true\"></user-details>\n                     {{$ctrl.saisie.date_creation | date:'medium'}}\n                     <div class=\"clearfix\"></div>\n                   </div>\n\n                   <div class=\"panel-body\" ng:style=\"{'padding': $ctrl.new_saisie ? 0 : 'inherit', 'border': $ctrl.new_saisie ? 0 : 'inherit'}\">\n\n                     <div class=\"col-md-12\"\n                          ta-bind\n                          ng:model=\"$ctrl.saisie.trusted_contenu\"\n                          ng:if=\"!$ctrl.edition\"></div>\n\n                     <div class=\"col-md-12\"\n                          ng:style=\"{'padding': $ctrl.new_saisie ? 0 : 'inherit'}\"\n                          ng:if=\"$ctrl.edition\">\n                       <text-angular ta:target-toolbars=\"main-ta-toolbar-{{$ctrl.toolbar_id}}\"\n                                     ng:model=\"$ctrl.saisie.contenu\"\n                                     ng:change=\"$ctrl.dirty = true\"></text-angular>\n                       <div class=\"suivi-ta-toolbar gris2-moins\">\n                         <text-angular-toolbar class=\"pull-left\"\n                                               style=\"margin-left: 0;\"\n                                               name=\"main-ta-toolbar-{{$ctrl.toolbar_id}}\"></text-angular-toolbar>\n\n                         <button class=\"btn\" style=\"margin-left: 6px;\"\n                                 ng:model=\"$ctrl.saisie.tmp_pinned\"\n                                 ng:change=\"$ctrl.dirty = true\"\n                                 ng:class=\"{'btn-warning': $ctrl.saisie.tmp_pinned, 'btn-default': !$ctrl.saisie.tmp_pinned}\"\n                                 uib:btn-checkbox\n                                 btn:checkbox-true=\"true\"\n                                 btn:checkbox-false=\"false\">\n                           <span class=\"glyphicon glyphicon-pushpin\" ></span> \u00C9pingler\n                         </button>\n\n                         <button class=\"btn btn-success pull-right\"\n                                 ng:disabled=\"!$ctrl.dirty || !$ctrl.onglet\"\n                                 ng:click=\"$ctrl.save()\">\n                           <span class=\"glyphicon glyphicon-save\" ></span> Publier\n                         </button>\n                         <button class=\"btn btn-default pull-right\"\n                                 ng:click=\"$ctrl.cancel()\"\n                                 ng:if=\"$ctrl.saisie.id\">\n                           <span class=\"glyphicon glyphicon-edit\" ></span> Annuler\n                         </button>\n\n                         <button class=\"btn btn-danger pull-right\"\n                                 ng:click=\"$ctrl.delete()\"\n                                 ng:if=\"$ctrl.saisie.id && ( $ctrl.editable || $ctrl.current_user.is_admin() )\">\n                           <span class=\"glyphicon glyphicon-trash\"></span> Supprimer\n                         </button>\n                         <div class=\"clearfix\"></div>\n                       </div>\n                     </div>\n                   </div>\n\n                   <div class=\"panel-footer\" ng:if=\"!$ctrl.edition\">\n                     <div class=\"pull-right buttons\">\n                       <button class=\"btn btn-default\"\n                               ng:click=\"$ctrl.toggle_edit()\"\n                               ng:if=\"$ctrl.editable\">\n                         <span class=\"glyphicon glyphicon-edit\" ></span> \u00C9diter\n                       </button>\n                     </div>\n                     <div class=\"clearfix\"></div>\n                   </div>\n                 </div>\n\n"
});
angular.module('suiviApp')
    .component('trombinoscope', {
    controller: ['$filter', '$q', 'URL_ENT', 'APIs', 'Popups', 'User', 'UID',
        function ($filter, $q, URL_ENT, APIs, Popups, User, UID) {
            var ctrl = this;
            ctrl.pretty_labels = {
                "CLS": "classe",
                "GRP": "groupe d'élèves",
                "GPL": "groupe libre"
            };
            ctrl.popup_onglet_batch = Popups.onglet_batch;
            ctrl.popup_batch = Popups.batch;
            ctrl.popup_onglet_batch_callback = function (feedback) { console.log(feedback); };
            ctrl.popup_publish_batch = Popups.publish_batch;
            ctrl.filters = {
                text: '',
                groups: [],
                grades: []
            };
            ctrl.only_display_relevant_to = false;
            ctrl.eleves = [];
            ctrl.groups = [];
            ctrl.structures = [];
            var fix_avatar_url = function (avatar_url) {
                return (_(avatar_url.match(/^(user|http)/)).isNull() ? URL_ENT + "/" : '') + avatar_url;
            };
            ctrl.apply_filters = function () {
                var selected_structures_ids = _.chain(ctrl.structures).where({ selected: true }).pluck('id').value();
                var selected_groups_ids = _.chain(ctrl.groups).where({ selected: true }).pluck('id').value();
                var selected_grades_ids = _.chain(ctrl.grades).where({ selected: true }).pluck('id').value();
                var grades_ids_from_groups_ids = function (groups_ids) {
                    return _.chain(ctrl.groups)
                        .select(function (group) { return _(groups_ids).contains(group.id); })
                        .pluck("grades")
                        .flatten()
                        .pluck("grade_id")
                        .uniq()
                        .value();
                };
                var structures_ids_from_groups_ids = function (groups_ids) {
                    return _.chain(ctrl.groups)
                        .select(function (group) { return _(groups_ids).contains(group.id); })
                        .pluck("structure_id")
                        .uniq()
                        .value();
                };
                return function (pupil) {
                    return ("" + pupil.firstname + pupil.lastname).toLocaleLowerCase().includes(ctrl.filters.text.toLocaleLowerCase())
                        && (selected_structures_ids.length == 0 || _(selected_structures_ids).intersection(structures_ids_from_groups_ids(_(pupil.groups).pluck('group_id'))).length > 0)
                        && (selected_groups_ids.length == 0 || _(selected_groups_ids).intersection(_(pupil.groups).pluck('group_id')).length > 0)
                        && (selected_grades_ids.length == 0 || _(selected_grades_ids).intersection(grades_ids_from_groups_ids(_(pupil.groups).pluck('group_id'))).length > 0)
                        && (!ctrl.only_display_relevant_to || pupil.relevant);
                };
            };
            ctrl.clear_filters = function (type) {
                if (_(['CLS', 'GRP', 'GPL']).contains(type)) {
                    _.chain(ctrl['groups']).select(function (item) { return item.selected && item.type == type; }).each(function (item) { item.selected = false; });
                }
                else {
                    _(ctrl[type]).each(function (item) { item.selected = false; });
                }
            };
            ctrl.pluck_selected_uids = function () {
                var filter = ctrl.apply_filters();
                return _.chain(ctrl.eleves)
                    .select(function (pupil) { return filter(pupil); })
                    .reject(function (pupil) { return pupil.excluded; })
                    .pluck('id')
                    .value();
            };
            ctrl.pluriel = function (item_count, character) {
                return item_count > 1 ? character : '';
            };
            User.get({ id: UID }).$promise
                .then(function (response) {
                ctrl.current_user = response;
                ctrl.current_user.avatar = fix_avatar_url(ctrl.current_user.avatar);
                return APIs.query_carnets_relevant_to(ctrl.current_user.id);
            }, function error(response) { })
                .then(function success(response) {
                ctrl.relevant_to = _(response.data).pluck('uid_eleve');
                return ctrl.current_user.get_actual_groups();
            }, function error(response) { })
                .then(function (groups) {
                console.log(groups);
                var users_ids = [];
                var promises = [];
                var process_groups = function (groups) {
                    ctrl.groups = ctrl.groups.concat(_(groups).select(function (group) { return group.type == "GPL" || _(group.users).findWhere({ type: "ELV" }) != undefined; }));
                    APIs.get_grades(_.chain(ctrl.groups)
                        .pluck('grades')
                        .flatten()
                        .pluck('grade_id')
                        .value())
                        .then(function success(response) {
                        ctrl.grades = response.data;
                    }, function error(response) { });
                    users_ids = users_ids.concat(_.chain(groups)
                        .pluck("users")
                        .flatten()
                        .compact()
                        .select(function (user) { return user.type == "ELV"; })
                        .pluck("user_id")
                        .value());
                };
                var process_structures_ids = function (structures_ids) {
                    if (structures_ids.length > 1) {
                        APIs.get_structures(structures_ids).then(function (response) {
                            ctrl.structures = ctrl.structures.concat(response.data);
                        });
                    }
                };
                if (_.chain(ctrl.current_user.profiles).pluck("type").contains("ELV").value()) {
                    users_ids.push(ctrl.current_user.id);
                }
                users_ids = users_ids.concat(_(ctrl.current_user.children).pluck('child_id'));
                var groups_ids = _.chain(groups)
                    .reject(function (group) { return _(["ELV"]).contains(group.type); })
                    .pluck("id")
                    .value();
                if (groups_ids.length > 0) {
                    promises.push(APIs.get_groups(groups_ids)
                        .then(function (response) {
                        process_structures_ids(_.chain(response.data)
                            .pluck("structure_id")
                            .uniq()
                            .value());
                        process_groups(response.data);
                    }));
                }
                var structures_ids = _.chain(ctrl.current_user.profiles)
                    .select(function (profile) { return _(["ADM", "DIR", "DOC", "ETA", "EVS", "ORI"]).contains(profile.type); })
                    .pluck("structure_id")
                    .uniq()
                    .value();
                if (!_(structures_ids).isEmpty()) {
                    process_structures_ids(structures_ids);
                    promises.push(APIs.get_groups_of_structures(structures_ids)
                        .then(function (response) {
                        process_groups(response.data);
                    }));
                }
                $q.all(promises).then(function () {
                    users_ids = _(users_ids).uniq();
                    while (users_ids.length > 0) {
                        APIs.get_users(users_ids.splice(0, 200))
                            .then(function (users) {
                            ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function (eleve) {
                                eleve.avatar = fix_avatar_url(eleve.avatar);
                                eleve.excluded = false;
                                eleve.relevant = _(ctrl.relevant_to).contains(eleve.id);
                                var classe = _.chain(eleve.groups)
                                    .map(function (group) {
                                    return _(ctrl.groups).findWhere({ id: group.group_id, type: "CLS" });
                                })
                                    .compact()
                                    .first()
                                    .value();
                                if (classe != undefined) {
                                    eleve.regroupement = {
                                        id: classe.id,
                                        name: classe.name,
                                        type: classe.type
                                    };
                                    eleve.etablissement = classe.structure_id;
                                    eleve.enseignants = classe.profs;
                                }
                                return eleve;
                            }));
                            ctrl.eleves = _(ctrl.eleves).uniq(function (eleve) { return eleve.id; });
                        });
                    }
                });
            });
        }],
    template: "\n<style>\n  .trombinoscope .petite.case { border: 1px solid transparent; }\n  .filter .panel-body { max-height: 380px; overflow-y: auto; }\n  .trombinoscope .excluded .eleve { opacity: 0.8; }\n  .regroupement {background-color: rgba(240, 240, 240, 0.66);}\n  .trombinoscope .excluded .eleve .full-name { color: lightgray; text-decoration: double line-through; }\n</style>\n<div class=\"col-md-4 gris1-moins aside trombinoscope-aside\" style=\"padding: 0;\">\n  <div class=\"panel panel-default gris1-moins\">\n    <div class=\"panel-heading\" style=\"text-align: right; \">\n      <h3>\n        {{$ctrl.pluck_selected_uids().length}} \u00E9l\u00E8ve{{$ctrl.pluriel($ctrl.pluck_selected_uids().length, 's')}}<span ng:if=\"$ctrl.current_user.can_do_batch\"> s\u00E9lectionn\u00E9{{$ctrl.pluriel($ctrl.filtered.length, 's')}}</span>\n\n        <a class=\"btn btn-primary\"\n           title=\"Gestion des onglets communs\"\n           ng:if=\"$ctrl.current_user.can_do_batch\"\n           ui:sref=\"carnet({uids: $ctrl.pluck_selected_uids()})\">\n          <span class=\"glyphicon glyphicon-user\"></span>\n          <span class=\"glyphicon glyphicon-user\" style=\"font-size: 125%; margin-left: -11px; margin-right: -11px;\"></span>\n          <span class=\"glyphicon glyphicon-user\"></span>\n        </a>\n      </h3>\n    </div>\n    <div class=\"panel-body\">\n\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <input class=\"form-control input-lg\"\n                 style=\"display: inline; background-color: rgba(240, 240, 240, 0.66);\"\n                 type=\"text\" name=\"search\"\n                 ng:model=\"$ctrl.filters.text\" />\n          <button class=\"btn btn-xs\" style=\"color: green; margin-left: -44px; margin-top: -4px;\"\n                  ng:click=\"$ctrl.filters.text = ''\"\n                  ng:disabled=\"$ctrl.filters.text.length == 0\">\n            <span class=\"glyphicon glyphicon-remove\"></span>\n          </button>\n        </div>\n      </div>\n\n      <div class=\"row\" style=\"margin-top: 14px;\">\n        <div class=\"col-md-6 filter\"\n             ng:repeat=\"grp_type in ['CLS', 'GRP', 'GPL']\"\n             ng:if=\"$ctrl.groups.length > 0\">\n          <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n              Filtrage par {{$ctrl.pretty_labels[grp_type]}}\n\n              <button class=\"btn btn-xs pull-right\" style=\"color: green;\"\n                      ng:click=\"$ctrl.clear_filters( grp_type )\">\n                <span class=\"glyphicon glyphicon-remove\">\n                </span>\n              </button>\n              <div class=\"clearfix\"></div>\n            </div>\n\n            <div class=\"panel-body\">\n              <div class=\"btn-group\">\n                <button class=\"btn btn-sm\" style=\"margin: 2px; font-weight: bold; color: #fff;\"\n                        ng:repeat=\"group in $ctrl.groups | filter:{type: grp_type} | orderBy:['name']\"\n                        ng:class=\"{'vert-plus': group.selected, 'vert-moins': !group.selected}\"\n                        ng:model=\"group.selected\"\n                        uib:btn-checkbox>\n                  {{group.name}}\n                </button>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"col-md-6 filter\" ng:if=\"$ctrl.grades.length > 0\">\n          <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n              Filtrage par niveau\n\n              <button class=\"btn btn-xs pull-right\" style=\"color: green;\"\n                      ng:click=\"$ctrl.clear_filters('grades')\">\n                <span class=\"glyphicon glyphicon-remove\">\n                </span>\n              </button>\n              <div class=\"clearfix\"></div>\n            </div>\n\n            <div class=\"panel-body\">\n              <div class=\"btn-group\">\n                <button class=\"btn btn-sm\" style=\"margin: 2px; font-weight: bold; color: #fff;\"\n                        ng:repeat=\"grade in $ctrl.grades | orderBy:['name']\"\n                        ng:class=\"{'vert-plus': grade.selected, 'vert-moins': !grade.selected}\"\n                        ng:model=\"grade.selected\"\n                        uib:btn-checkbox>\n                  {{grade.name}}\n                </button>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"col-md-6 filter\" ng:if=\"$ctrl.structures.length > 1\">\n          <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n              Filtrage par \u00E9tablissements\n\n              <button class=\"btn btn-xs pull-right\" style=\"color: green;\"\n                      ng:click=\"$ctrl.clear_filters('structures')\">\n                <span class=\"glyphicon glyphicon-remove\">\n                </span>\n              </button>\n              <div class=\"clearfix\"></div>\n            </div>\n\n            <div class=\"panel-body\">\n              <div class=\"btn-group\">\n                <button class=\"btn btn-sm\" style=\"margin: 2px; font-weight: bold; color: #fff;\"\n                        ng:repeat=\"structure in $ctrl.structures | orderBy:['name']\"\n                        ng:class=\"{'vert-plus': structure.selected, 'vert-moins': !structure.selected}\"\n                        ng:model=\"structure.selected\"\n                        uib:btn-checkbox>\n                  {{structure.name}}\n                </button>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n\n</div>\n\n<div class=\"col-md-8 vert-moins damier trombinoscope\">\n  <ul>\n    <li class=\"col-xs-6 col-sm-4 col-md-3 col-lg-2 petite case vert-moins\"\n        style=\"background-repeat: no-repeat; background-attachment: scroll; background-clip: border-box; background-origin: padding-box; background-position-x: center; background-position-y: center; background-size: 100% auto;\"\n        ng:class=\"{'relevant': eleve.relevant, 'excluded': eleve.excluded}\"\n        ng:style=\"{'background-image': 'url( {{eleve.avatar}} )' }\"\n        ng:repeat=\"eleve in $ctrl.filtered = ( $ctrl.eleves | filter:$ctrl.apply_filters() | orderBy:['regroupement.name', 'lastname'] )\">\n      <button class=\"btn btn-danger pull-left\" style=\"height: 10%;\"\n              title=\"exclure de la s\u00E9lection\"\n              ng:style=\"{'opacity': eleve.excluded ? '1' : '0.5'}\"\n              uib:btn-checkbox ng:model=\"eleve.excluded\"\n              ng:if=\"$ctrl.current_user.can_do_batch\">\n        <span class=\"glyphicon glyphicon-ban-circle\"></span>\n      </button>\n      <h5 class=\"regroupement pull-right\" style=\"height: 10%;\">{{eleve.regroupement.name}}</h5>\n      <a class=\"eleve\" style=\"height: 90%; margin-top: 10%;\"\n         ui:sref=\"carnet({uids: [eleve.id]})\">\n\n        <div class=\"full-name\" title=\"{{eleve.relevant ? 'Vous \u00EAtes contributeur de ce carnet' : ''}}\">\n          <h4 class=\"first-name\">{{eleve.firstname}}</h4>\n          <h4 class=\"last-name\">{{eleve.lastname}}</h4>\n        </div>\n      </a>\n    </li>\n  </ul>\n</div>\n"
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
    controller: ['APIs', 'URL_ENT', 'User',
        function (APIs, URL_ENT, User) {
            var ctrl = this;
            ctrl.URL_ENT = URL_ENT;
            ctrl.$onInit = function () {
                User.get({ id: ctrl.uid }).$promise
                    .then(function success(response) {
                    ctrl.user = response;
                    if (ctrl.showClasse) {
                        ctrl.user.get_actual_groups()
                            .then(function (response) {
                            ctrl.user.actual_groups = response;
                            ctrl.user.actual_groups.forEach(function (group) {
                                APIs.get_structure(group.structure_id)
                                    .then(function (response) {
                                    group.structure = response.data;
                                });
                            });
                        });
                    }
                    if (ctrl.showConcernedPeople) {
                        ctrl.user.query_people_concerned_about()
                            .then(function success(response) {
                            ctrl.concerned_people = _(response).groupBy('type');
                            delete ctrl.concerned_people['Élève'];
                        }, function error(response) { });
                    }
                }, function error(response) { });
            };
        }],
    template: "\n                          <div class=\"col-md-12\">\n                            <div class=\"avatar-container gris4 pull-left\" ng:style=\"{'height': $ctrl.small ? '44px' : '175px', 'width': $ctrl.small ? '44px' : '175px'}\">\n                              <img class=\"avatar noir-moins\"\n                                   ng:style=\"{'max-height': $ctrl.small ? '44px' : '175px', 'max-width': $ctrl.small ? '44px' : '175px'}\"\n                                   ng:src=\"{{$ctrl.URL_ENT + '/' + $ctrl.user.avatar}}\"\n                                   ng:if=\"$ctrl.showAvatar\" />\n                            </div>\n                            <div class=\"col-md-8 details\" ng:style=\"{'min-height': $ctrl.small ? '44px' : '175px'}\">\n                              <div class=\"col-md-12\">\n                                <span class=\"first-name\"\n                                      ng:style=\"{'font-size': $ctrl.small ? '100%' : '150%'}\"> {{$ctrl.user.firstname}}\n                                </span>\n                                <span class=\"last-name\"\n                                      ng:style=\"{'font-size': $ctrl.small ? '100%' : '175%'}\"> {{$ctrl.user.lastname}}\n                                </span>\n                              </div>\n\n                              <span class=\"col-md-12 classe\" ng:if=\"$ctrl.showClasse\">\n                                <span ng:repeat=\"group in $ctrl.user.actual_groups | filter:{type: 'CLS'}\">\n                                  {{group.name}} - {{group.structure.name}}\n                                </span>\n                              </span>\n\n                              <span class=\"col-md-12 birthdate\" ng:if=\"$ctrl.showBirthdate\">\n                                n\u00E9<span ng:if=\"$ctrl.user.gender === 'F'\">e</span> le {{$ctrl.user.birthdate | date}}\n                              </span>\n                              <div class=\"col-md-12 email\"\n                                   ng:repeat=\"email in $ctrl.user.emails\"\n                                   ng:if=\"$ctrl.showEmails\">\n                                <span class=\"glyphicon glyphicon-envelope\">\n                                </span>\n                                <a href=\"mailto:{{email.address}}\">{{email.address}}</a>\n                              </div>\n                              <span class=\"col-md-12 address\"\n                                    ng:if=\"$ctrl.showAddress && $ctrl.user.adresse\">\n                                <span class=\"glyphicon glyphicon-home\">\n                                </span>\n                                <span style=\"display: inline-table;\">\n                                  {{$ctrl.user.address}}\n                                  <br>\n                                  {{$ctrl.user.zipcode}} {{$ctrl.user.city}}\n                                </span>\n                              </span>\n                              <div class=\"col-md-12 phone\"\n                                   ng:repeat=\"phone in $ctrl.user.phones\"\n                                   ng:if=\"$ctrl.showPhones\">\n                                <span class=\"glyphicon\"\n                                      ng:class=\"{'glyphicon-phone': phone.type === 'PORTABLE', 'glyphicon-phone-alt': phone.type !== 'PORTABLE'}\">\n                                  {{phone.type}}: {{phone.number}}\n                                </span>\n                              </div>\n                            </div>\n                          </div>\n\n                          <fieldset class=\"pull-left col-md-12 parents\" ng:if=\"$ctrl.showConcernedPeople\">\n                            <legend>Personnes concern\u00E9es</legend>\n                            <uib-accordion>\n                              <div uib-accordion-group\n                                   class=\"panel-default\"\n                                   ng:repeat=\"(type, peoples) in $ctrl.concerned_people\"\n                                   ng:if=\"type != 'Autre \u00E9l\u00E8ve suivi'\">\n                                <uib-accordion-heading>\n                                  <span class=\"glyphicon\" ng:class=\"{'glyphicon-menu-down': type.is_open, 'glyphicon-menu-right': !type.is_open}\">\n                                  </span> {{type}}\n                                </uib-accordion-heading>\n                                <ul>\n                                  <li ng:repeat=\"people in peoples | orderBy:'lastname'\">\n                                    <span ng:if=\"!people.relevant_to\">{{people.firstname}} {{people.lastname}}</span>\n                                    <span ng:if=\"people.relevant_to\">\n                                      <a ui:sref=\"carnet({uid_eleve: people.id})\">{{people.firstname}} {{people.lastname}}</a>\n                                    </span>\n                                    <span ng:if=\"people.prof_principal\"> (enseignant principal)</span>\n                                    <span ng:if=\"people.actual_subjects\">\n                                      <br/>\n                                      <em ng:repeat=\"subject in people.actual_subjects\">\n                                        <span class=\"glyphicon glyphicon-briefcase\">\n                                        </span> {{subject.name}}\n                                      </em>\n                                    </span>\n                                    <span ng:if=\"people.emails.length > 0\">\n                                      <br/>\n                                      <span class=\"glyphicon glyphicon-envelope\">\n                                      </span>\n                                      <a href=\"mailto:{{people.emails[0].address}}\">{{people.emails[0].address}}</a>\n                                    </span>\n                                  </li>\n                                </ul>\n                              </div>\n                            </uib-accordion>\n                          </fieldset>\n"
});
angular.module('suiviApp')
    .factory('Droits', ['$resource', 'APP_PATH',
    function ($resource, APP_PATH) {
        return $resource(APP_PATH + "/api/droits/:id", {
            id: '@id'
        }, {
            save: {
                method: 'POST',
                isArray: true
            },
            update: { method: 'PUT' }
        });
    }]);
angular.module('suiviApp')
    .factory('Onglets', ['$resource', 'APP_PATH',
    function ($resource, APP_PATH) {
        return $resource(APP_PATH + "/api/onglets/:id", {
            id: '@id'
        }, {
            save: {
                method: 'POST',
                isArray: true
            },
            update: {
                method: 'PUT',
                isArray: true
            }
        });
    }]);
angular.module('suiviApp')
    .factory('Saisies', ['$resource', 'APP_PATH',
    function ($resource, APP_PATH) {
        return $resource(APP_PATH + "/api/saisies/:id", {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    }]);
angular.module('suiviApp')
    .factory('User', ['$resource', '$rootScope', '$q', 'APIs', 'URL_ENT',
    function ($resource, $rootScope, $q, APIs, URL_ENT) {
        return $resource(URL_ENT + "/api/users/:id", {
            id: "@id",
            expand: "@expand"
        }, {
            get: {
                cache: false,
                transformResponse: function (response) {
                    var user = angular.fromJson(response);
                    user.is_admin = function () {
                        return user.profiles.length > 0
                            && _(user.profiles).findWhere({ type: 'ADM' }) != undefined;
                    };
                    user.can_do_batch = _(["ADM", "DIR", "DOC", "ENS", "ETA", "EVS", "ORI", "TUT"]).intersection(_(user.profiles).pluck("type")).length > 0;
                    user.can_add_tab = function (uids) {
                        return user.can_do_batch || ((uids.length == 1) && uids[0] == user.id);
                    };
                    user.get_actual_groups = function () {
                        return APIs.get_groups(_(user.groups).pluck('group_id'))
                            .then(function (response) {
                            user.actual_groups = response.data;
                            return $q.resolve(user.actual_groups);
                        });
                    };
                    user.get_actual_subjects = function () {
                        return APIs.get_subjects(_(user.groups).pluck('subject_id'))
                            .then(function (response) {
                            user.actual_subjects = response.data;
                            return $q.resolve(user.actual_subjects);
                        });
                    };
                    user.query_people_concerned_about = _.memoize(function () {
                        var concerned_people = new Array();
                        var profils = new Array();
                        var relevant_to = new Array();
                        var current_user = null;
                        var users = new Array();
                        var personnels = new Array();
                        var pupils = new Array();
                        var teachers = new Array();
                        var main_teachers = new Array();
                        return APIs.query_profiles_types()
                            .then(function success(response) {
                            profils = _(response.data).indexBy('id');
                            if (!_(user.parents).isEmpty()) {
                                return APIs.get_users(_(user.parents).pluck('parent_id'));
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
                            if (user.profiles.length > 0) {
                                return APIs.get_structures(_(user.profiles).pluck("structure_id"));
                            }
                            else {
                                return $q.resolve({ no_profile: true });
                            }
                        }, function error(response) { return $q.reject(response); })
                            .then(function success(response) {
                            if (_(response).has('data')) {
                                personnels = _.chain(response.data)
                                    .pluck("profiles")
                                    .flatten()
                                    .reject(function (user) {
                                    return _(['ELV', 'TUT', 'ENS']).contains(user.type);
                                })
                                    .uniq(function (user) { return user.id; })
                                    .value();
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
                                var groups_ids = _(user.groups).pluck('group_id');
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
                    return user;
                }
            }
        });
    }]);
angular.module('suiviApp')
    .service('APIs', ['$http', '$q', 'Onglets', 'URL_ENT', 'APP_PATH',
    function ($http, $q, Onglets, URL_ENT, APP_PATH) {
        var APIs = this;
        APIs.query_profiles_types = _.memoize(function () {
            return $http.get(URL_ENT + "/api/profiles_types");
        });
        APIs.get_users = _.memoize(function (users_ids) {
            if (_(users_ids).isEmpty()) {
                return $q.resolve({ data: [] });
            }
            else {
                return $http.get(URL_ENT + "/api/users/", { params: { 'id[]': users_ids } });
            }
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
        APIs.query_carnets_relevant_to = function (uid) {
            return $http.get(APP_PATH + "/api/carnets/relevant/" + uid);
        };
        APIs.get_structure = _.memoize(function (uai) {
            return $http.get(URL_ENT + "/api/structures/" + uai);
        });
        APIs.get_structures = _.memoize(function (uais) {
            return $http.get(URL_ENT + "/api/structures/", { params: { 'id[]': uais } });
        });
        APIs.query_common_onglets_of = function (uids) {
            return Onglets.query({ "uids[]": uids }).$promise
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
    }]);
angular.module('suiviApp')
    .service('Popups', ['$uibModal', '$q', 'Onglets', 'Droits', 'Saisies', 'APIs', 'UID', 'User',
    function ($uibModal, $q, Onglets, Droits, Saisies, APIs, UID, User) {
        var Popups = this;
        Popups.loading_window = function (title, text, action) {
            return swal({
                title: title,
                text: text,
                type: "info",
                showLoaderOnConfirm: true,
                onOpen: function () {
                    return swal.clickConfirm();
                },
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        action()
                            .then(function success(response) {
                            swal.closeModal();
                        }, function error(response) {
                            console.log(response);
                            swal.closeModal();
                            swal({
                                title: 'Erreur :(',
                                text: response.data.error,
                                type: 'error'
                            });
                        });
                    });
                },
                allowOutsideClick: false
            });
        };
        Popups.onglet = function (uids, onglet, all_onglets, callback) {
            $uibModal.open({
                template: "\n<div class=\"modal-header\">\n<h3 class=\"modal-title\">\nPropri\u00E9t\u00E9s de l'onglet\n</h3>\n</div>\n\n<div class=\"modal-body\">\n<label>Titre : <input type=\"text\" maxlength=\"45\" ng:model=\"$ctrl.onglet.nom\" ng:maxlength=\"45\" ng:change=\"$ctrl.onglet.dirty = true; $ctrl.name_validation()\" />\n<span class=\"label label-danger\" ng:if=\"!$ctrl.valid_name\">Un onglet existant porte d\u00E9j\u00E0 ce nom !</span>\n</label>\n\n<span class=\"label label-info\" ng:if=\"$ctrl.uids\">L'\u00E9l\u00E8ve aura un acc\u00E8s en lecture/\u00E9criture \u00E0 cet onglet.</span>\n<droits uid-eleve=\"$ctrl.uids\"\ndroits=\"$ctrl.droits\"\nconcerned-people=\"$ctrl.concerned_people\"\nng:if=\"$ctrl.droits\"></droits>\n\n<div class=\"clearfix\"></div>\n</div>\n\n<div class=\"modal-footer\">\n<button class=\"btn btn-danger pull-left\"\nng:click=\"$ctrl.delete()\"\nng:if=\"$ctrl.onglet.id || $ctrl.onglet.ids\">\n<span class=\"glyphicon glyphicon-trash\"></span>\n<span> Supprimer l'onglet</span>\n</button>\n<button class=\"btn btn-default\"\nng:click=\"$ctrl.cancel()\">\n<span class=\"glyphicon glyphicon-remove-sign\"></span>\n<span ng:if=\"$ctrl.onglet.nom\"> Annuler</span>\n<span ng:if=\"!$ctrl.onglet.nom\"> Fermer</span>\n</button>\n<button class=\"btn btn-success\"\nng:click=\"$ctrl.ok()\"\nng:disabled=\"!$ctrl.onglet.nom || !$ctrl.valid_name\">\n<span class=\"glyphicon glyphicon-ok-sign\"></span> Valider\n</button>\n</div>\n",
                resolve: {
                    uids: function () { return uids; },
                    onglet: function () { return _(onglet).isNull() ? { nom: '' } : onglet; },
                    all_onglets: function () { return all_onglets; }
                },
                controller: ['$scope', '$uibModalInstance', '$q', 'Droits', 'APIs', 'URL_ENT', 'DEFAULT_RIGHTS_ONGLET', 'UID', 'uids', 'onglet', 'all_onglets',
                    function PopupOngletCtrl($scope, $uibModalInstance, $q, Droits, APIs, URL_ENT, DEFAULT_RIGHTS_ONGLET, UID, uids, onglet, all_onglets) {
                        var ctrl = $scope;
                        ctrl.$ctrl = ctrl;
                        ctrl.uids = uids;
                        ctrl.onglet = onglet;
                        ctrl.all_onglets = all_onglets;
                        ctrl.onglet.delete = false;
                        ctrl.valid_name = true;
                        if (_(ctrl.onglet).has('id')) {
                            Droits.query({
                                onglet_id: ctrl.onglet.id
                            }).$promise
                                .then(function success(response) {
                                ctrl.droits = _(response).map(function (droit) {
                                    return new Droits(droit);
                                });
                            }, function error(response) { });
                        }
                        else {
                            ctrl.droits = [new Droits({ uid: UID, read: true, write: true, manage: true })];
                            ctrl.droits.push(new Droits({ uid: uids, read: true, write: true, manage: false }));
                            ctrl.droits = ctrl.droits.concat(_(DEFAULT_RIGHTS_ONGLET)
                                .map(function (droit) {
                                var proper_droit = new Droits(droit);
                                proper_droit.dirty = { profil_id: true, read: true, write: true, manage: true };
                                return proper_droit;
                            }));
                        }
                        if (uids.length == 1) {
                            User.get({ id: uids[0] }).$promise
                                .then(function success(response) {
                                ctrl.eleve = response;
                                ctrl.eleve.query_people_concerned_about(uids[0])
                                    .then(function success(response) {
                                    ctrl.concerned_people = response;
                                }, function error(response) { });
                            }, function error(response) { });
                        }
                        else {
                            User.get({ id: UID }).$promise
                                .then(function success(response) {
                                ctrl.concerned_people = [response];
                                return APIs.get_users(uids);
                            }, function error(response) { })
                                .then(function success(response) {
                                ctrl.concerned_people = ctrl.concerned_people.concat(response.data);
                            }, function error(response) { });
                        }
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
                                .then(function (result) {
                                ctrl.onglet.delete = true;
                                ctrl.ok();
                            });
                        };
                        ctrl.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
            })
                .result.then(function success(response_popup) {
                var promise = null;
                var action = 'rien';
                if (_(onglet).isNull()) {
                    action = 'created';
                    promise = Onglets.save({
                        uids: uids,
                        nom: response_popup.onglet.nom
                    }).$promise;
                }
                else {
                    if (response_popup.onglet.delete) {
                        action = 'deleted';
                        response_popup.onglet["ids[]"] = response_popup.onglet.ids;
                        delete response_popup.onglet.ids;
                        promise = Onglets.delete(response_popup.onglet).$promise;
                    }
                    else if (response_popup.onglet.dirty) {
                        promise = Onglets.update(response_popup.onglet).$promise;
                    }
                    else {
                        promise = $q.resolve(response_popup.onglet);
                    }
                }
                promise.then(function success(response) {
                    if (response.id != undefined) {
                        response = [response];
                    }
                    var onglets_ids = response.map(function (onglet) { return onglet.id; });
                    response.action = action;
                    if (action != 'deleted') {
                        _.chain(response_popup.droits)
                            .reject(function (droit) {
                            return action == 'created' && _(droit).has('uid') && (droit.uid == UID || droit.uid == uids);
                        })
                            .each(function (droit) {
                            if (droit.to_delete) {
                                if (_(droit).has('id')) {
                                    Droits.delete(droit);
                                }
                            }
                            else if (droit.dirty
                                && (droit.uid !== '...' && droit.profil_id !== '...' && droit.sharable_id !== '...')
                                && _(droit.dirty).reduce(function (memo, value) { return memo || value; }, false)
                                && droit.read) {
                                droit.onglets_ids = onglets_ids;
                                _(droit).has('id') ? Droits.update(droit) : Droits.save(droit);
                            }
                        });
                    }
                    callback(response);
                }, function error() { });
            }, function error() { });
        };
    }]);
