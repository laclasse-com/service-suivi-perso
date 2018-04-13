angular.module('suiviApp')
  .service('APIs',
           ['$http', '$q', 'Onglets', 'URL_ENT', 'APP_PATH',
            function($http, $q, Onglets, URL_ENT, APP_PATH) {
              let APIs = this;

              APIs.query_profiles_types = _.memoize(function() {
                return $http.get(`${URL_ENT}/api/profiles_types`);
              });

              APIs.get_users = _.memoize(function(users_ids) {
                if (_(users_ids).isEmpty()) {
                  return $q.resolve({ data: [] });
                } else {
                  return $http.get(`${URL_ENT}/api/users/`, { params: { 'id[]': users_ids } });
                }
              });

              APIs.get_group = _.memoize(function(regroupement_id) {
                return $http.get(`${URL_ENT}/api/groups/${regroupement_id}`);
              });

              APIs.get_groups = _.memoize(function(groups_ids) {
                if (_(groups_ids).isEmpty()) {
                  return $q.resolve({ data: [] });
                } else {
                  return $http.get(`${URL_ENT}/api/groups/`, { params: { 'id[]': groups_ids } });
                }
              });

              APIs.get_groups_of_structures = _.memoize(function(structures_ids) {
                return $http.get(`${URL_ENT}/api/groups/`, { params: { 'structure_id[]': structures_ids } });
              });

              APIs.get_grades = _.memoize(function(grades_ids) {
                if (_(grades_ids).isEmpty()) {
                  return $q.resolve({ data: [] });
                } else {
                  return $http.get(`${URL_ENT}/api/grades/`, { params: { 'id[]': grades_ids } });
                }
              });

              APIs.get_subjects = _.memoize(function(subjects_ids) {
                if (_(subjects_ids).isEmpty()) {
                  return $q.resolve({ data: [] });
                } else {
                  return $http.get(`${URL_ENT}/api/subjects/`, { params: { 'id[]': subjects_ids } });
                }
              });

              APIs.query_relevant_students = function(uid) {
                return $http.get(`${APP_PATH}/api/students/relevant/${uid}`);
              };

              APIs.get_structure = _.memoize(function(uai) {
                return $http.get(`${URL_ENT}/api/structures/${uai}`);
              });

              APIs.get_structures = _.memoize(function(uais) {
                return $http.get(`${URL_ENT}/api/structures/`, { params: { 'id[]': uais } });
              });

              APIs.query_common_onglets_of = function(uids) {
                return Onglets.query({ "uids[]": uids }).$promise
                  .then(function success(response) {
                    return $q.resolve(_.chain(response)
                                      .reject((i) => _(i).isEmpty())
                                      .map((i) => _(i).toArray())
                                      .flatten()
                                      .groupBy('name')
                                      .toArray()
                                      .select((tabgroup) => tabgroup.length == uids.length)
                                      .flatten()
                                      .groupBy('name')
                                      .value());
                  },
                        function error(response) { return $q.resolve({}); });
              };
            }]);
