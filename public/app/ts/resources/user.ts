'use strict';

angular.module('suiviApp')
  .factory('User',
  ['$resource', '$rootScope', '$q', 'APIs', 'URL_ENT', 'UID',
    function($resource, $rootScope, $q, APIs, URL_ENT, UID) {
      return $resource(`${URL_ENT}/api/users/${UID}`,
        { expand: 'true' },
        {
          get: {
            cache: false,
            transformResponse: function(response) {
              let user = angular.fromJson(response);

              user.profil_actif = _(user.profiles).findWhere({ active: true });

              user.is_admin = function() {
                return !_(user.profil_actif).isUndefined()
                  && _(user.profiles)
                    .findWhere({
                      structure_id: user.profil_actif.structure_id,
                      type: 'ADM'
                    }) != undefined;
              };

              user.can_do_batch = !_(['ELV']).contains(user.profil_actif.type);

              user.can_add_tab = function(uids) {
                return !_(['ELV']).contains(user.profil_actif.type) || ((uids.length == 1) && uids[0] == user.id);
              };

              user.get_actual_groups = function() {
                let groups_ids = _.chain(user.groups).pluck('group_id').uniq().value();
                let promise = $q.resolve([]);
                if (_(['EVS', 'DIR', 'ADM']).contains(user.profil_actif.type) || user.profil_actif.admin) {
                  promise = APIs.get_groups_of_structures([user.profil_actif.structure_id]);
                } else {
                  promise = APIs.get_groups(groups_ids);
                }

                return promise
                  .then(function(groups) {
                    user.actual_groups = _(groups.data).select(function(group) {
                      return group.structure_id == user.profil_actif.structure_id;
                    });

                    return $q.resolve(user.actual_groups);
                  });
              };

              return user;
            }
          }
        });
    }]);
