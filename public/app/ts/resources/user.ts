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

                user.is_admin = function() {
                  return user.profiles.length > 0
                    && _(user.profiles).findWhere({ type: 'ADM' }) != undefined;
                };

                user.can_do_batch = _(["ADM", "DIR", "DOC", "ENS", "ETA", "EVS", "ORI", "TUT"]).intersection(_(user.profiles).pluck("type")).length > 0;

                user.can_add_tab = function(uids) {
                  return user.can_do_batch || ((uids.length == 1) && uids[0] == user.id);
                };

                user.get_actual_groups = function() {
                  return APIs.get_groups(_(user.groups).pluck('group_id'))
                    .then(function(response) {
                      user.actual_groups = response.data;
                      return $q.resolve(user.actual_groups);
                    });
                };

                user.get_actual_subjects = function() {
                  return APIs.get_subjects(_(user.groups).pluck('subject_id'))
                    .then(function(response) {
                      user.actual_subjects = response.data;
                      return $q.resolve(user.actual_subjects);
                    });
                };
                return user;
              }
            }
          });
      }]);
