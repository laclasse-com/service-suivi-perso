'use strict';
angular.module('suiviApp')
    .component('droitsOnglets', { bindings: { droits: '=',
        concernedPeople: '<' },
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
                droit.dirty = { uid: false,
                    profil_id: false,
                    sharable_id: false,
                    read: false,
                    write: false,
                    manage: false };
                ctrl.droits.push(new DroitsOnglets(droit));
            };
            ctrl.add_sharable = function (droit) {
                droit.sharable_id = gen_pseudo_UUID();
                ctrl.add(droit);
            };
            var maybe_init_dirtiness = function (droit) {
                if (!_(droit).has('dirty')) {
                    droit.dirty = { uid: false,
                        profil_id: false,
                        sharable_id: false,
                        read: false,
                        write: false,
                        manage: false };
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
