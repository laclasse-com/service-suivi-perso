angular.module('suiviApp')
    .component('trombinoscope', { controller: ['$q', 'URL_ENT', 'APIs',
        function ($q, URL_ENT, APIs) {
            var ctrl = this;
            ctrl.search = '';
            ctrl.only_display_contributed_to = false;
            ctrl.eleves = [];
            var current_user = undefined;
            var fix_avatar_url = function (avatar_url) {
                return (_(avatar_url.match(/^(user|http)/)).isNull() ? URL_ENT + '/' : '') + avatar_url;
            };
            APIs.get_current_user()
                .then(function (response) {
                current_user = response;
                current_user.avatar = fix_avatar_url(current_user.avatar);
                return APIs.get_current_user_groups();
            })
                .then(function (groups) {
                var classes = _(groups).where({ type: 'CLS' });
                if (current_user.profil_actif.type === 'ELV') {
                    current_user.regroupement = { libelle: classes[0].name };
                    ctrl.eleves = [current_user];
                }
                else if (current_user.profil_actif.type === 'TUT') {
                    var users_ids = _(current_user.children).pluck('child_id');
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
                                            eleve.regroupement = { id: regroupement.id,
                                                name: regroupement.name,
                                                type: regroupement.type };
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
                        return _(regroupement).has('structure_id') && regroupement.structure_id === current_user.profil_actif.structure_id;
                    })
                        .pluck('id')
                        .uniq()
                        .value())
                        .then(function success(response) {
                        ctrl.groups = response.data;
                        ctrl.eleves = [];
                        _(response.data).each(function (regroupement) {
                            regroupement.profs = _.chain(regroupement.users).select(function (user) { return user.type === 'ENS'; }).pluck('user_id').value();
                            var users_ids = _.chain(regroupement.users).select(function (user) { return user.type === 'ELV'; }).pluck('user_id').value();
                            APIs.get_users(users_ids)
                                .then(function (users) {
                                ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function (eleve) {
                                    eleve.avatar = fix_avatar_url(eleve.avatar);
                                    eleve.regroupement = { id: regroupement.id,
                                        name: regroupement.name,
                                        type: regroupement.type };
                                    eleve.etablissement = regroupement.structure_id;
                                    eleve.enseignants = regroupement.profs;
                                    return eleve;
                                }));
                            });
                        });
                    }, function error(response) { });
                }
                APIs.query_carnets_contributed_to(current_user.id)
                    .then(function success(response) {
                    ctrl.contributed_to = response.data;
                    _(ctrl.contributed_to).each(function (carnet) {
                        APIs.get_user(carnet.uid_eleve)
                            .then(function success(response) {
                            carnet.eleve = response.data;
                        }, function error(response) { });
                    });
                }, function error(response) { });
            });
        }],
    template: "\n<div class=\"col-md-4 blanc aside\" style=\"padding: 0;\">\n    <div class=\"search-filter\" style=\"padding: 20px; background-color: #baddad;\">\n        <label for=\"search\"> Filtrage des \u00E9l\u00E8ves affich\u00E9s : </label>\n        <input  class=\"form-control input-sm\"\n                style=\"display: inline; max-width: 300px;\"\n                type=\"text\" name=\"search\"\n                ng:model=\"$ctrl.search\" />\n    </div>\n    <div class=\"highlighted\" style=\"padding: 20px;\">\n        <label ng:if=\"$ctrl.contributed_to.length > 0\"> Carnet<span ng:if=\"$ctrl.contributed_to.length > 1\">s</span> <span ng:if=\"$ctrl.contributed_to.length > 1\">auxquels</span><span ng:if=\"$ctrl.contributed_to.length < 2\">auquel</span> vous avez contribu\u00E9 : </label>\n        <ul>\n            <li ng:repeat=\"carnet in $ctrl.contributed_to\"><a ui:sref=\"carnet({uid_eleve: carnet.eleve.id})\">{{carnet.eleve.firstname}} {{carnet.eleve.lastname}}</a></li>\n        </ul>\n    </div>\n</div>\n\n<div class=\"col-md-8 damier trombinoscope\">\n    <ul>\n        <li class=\"col-xs-6 col-sm-4 col-md-3 col-lg-2 petite case vert-moins\"\n            style=\"background-repeat: no-repeat; background-attachment: scroll; background-clip: border-box; background-origin: padding-box; background-position-x: center; background-position-y: center; background-size: 100% auto;\"\n            ng:style=\"{'background-image': 'url( {{eleve.avatar}} )' }\"\n            ng:repeat=\"eleve in $ctrl.eleves | filter:$ctrl.search | orderBy:['regroupement.name', 'lastname']\">\n            <a class=\"eleve\"\n               ui:sref=\"carnet({uid_eleve: eleve.id})\">\n                <h5 class=\"regroupement\">{{eleve.regroupement.name}}</h5>\n\n                <div class=\"full-name\">\n                    <h4 class=\"first-name\">{{eleve.firstname}}</h4>\n                    <h3 class=\"last-name\">{{eleve.lastname}}</h3>\n                </div>\n            </a>\n        </li>\n    </ul>\n</div>\n"
});
