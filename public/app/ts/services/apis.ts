angular.module('suiviApp')
  .service('APIs',
  ['$http', '$q', 'User', 'Onglets', 'URL_ENT', 'APP_PATH',
    function($http, $q, User, Onglets, URL_ENT, APP_PATH) {
      let APIs = this;

      APIs.query_profiles_types = _.memoize(function() {
        return $http.get(`${URL_ENT}/api/profiles_types`);
      });

      APIs.get_user = _.memoize(function(user_id) {
        return $http.get(`${URL_ENT}/api/users/${user_id}`)
          .then(function(response) {
            response.data.profil_actif = _(response.data.profiles).findWhere({ active: true });
            if (_(response.data.profil_actif).isUndefined() && !_(response.data.profiles).isEmpty()) {
              response.data.profil_actif = _(response.data.profiles).first();
            }

            response.data.get_actual_groups = function() {
              return APIs.get_groups(_(response.data.groups).pluck('group_id'))
                .then(function(groups) {
                  return $q.resolve(groups.data);
                });
            };

            response.data.get_actual_subjects = function() {
              return APIs.get_subjects(_(response.data.groups).pluck('subject_id'))
                .then(function(subjects) {
                  return $q.resolve(subjects.data);
                });
            };

            return response;
          });
      });

      APIs.get_current_user = _.memoize(function() {
        return User.get().$promise;
      });

      APIs.get_users = _.memoize(function(users_ids) {
        if (_(users_ids).isEmpty()) {
          return $q.resolve({ data: [] });
        } else {
          return $http.get(`${URL_ENT}/api/users/`, { params: { 'id[]': users_ids } });
        }
      });

      APIs.get_current_user_groups = _.memoize(function() {
        return APIs.get_current_user().then(function success(current_user) {
          let groups_ids = _.chain(current_user.groups).pluck('group_id').uniq().value();
          let promise = $q.resolve([]);
          if (_(['EVS', 'DIR', 'ADM']).contains(current_user.profil_actif.type) || current_user.profil_actif.admin) {
            promise = APIs.get_groups_of_structures([current_user.profil_actif.structure_id]);
          } else {
            promise = APIs.get_groups(groups_ids);
          }

          return promise
            .then(function(groups) {
              current_user.actual_groups = _(groups.data).select(function(group) {
                return group.structure_id === current_user.profil_actif.structure_id;
              });

              return $q.resolve(current_user.actual_groups);
            });
        });
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

      APIs.query_carnets_relevant_to = function(uid) {
        return $http.get(`${APP_PATH}/api/carnets/relevant/` + uid);
      };

      APIs.get_structure = _.memoize(function(uai) {
        return $http.get(`${URL_ENT}/api/structures/${uai}`);
      });

      APIs.query_common_onglets_of = function(uids) {
        return Onglets.query({ "uids[]": uids }).$promise
          .then(function success(response) {
            return $q.resolve(_.chain(response)
              .reject(function(i) { return _(i).isEmpty(); })
              .map(function(i) { return _(i).toArray(); })
              .flatten()
              .groupBy('nom')
              .toArray()
              .select(function(tabgroup) {
                return tabgroup.length == uids.length;
              })
              .flatten()
              .groupBy('nom')
              .value());
          },
          function error(response) { return $q.resolve({}); });
      };

      APIs.query_people_concerned_about = _.memoize(function(uid) {
        let eleve = null;
        let concerned_people: Array<any> = new Array<any>();
        let profils: Array<any> = new Array<any>();
        let relevant_to: Array<any> = new Array<any>();
        let current_user = null;
        let users: Array<any> = new Array<any>();
        let personnels: Array<any> = new Array<any>();
        let pupils: Array<any> = new Array<any>();
        let teachers: Array<any> = new Array<any>();
        let main_teachers: Array<any> = new Array<any>();

        return APIs.get_current_user()
          .then(function success(response) {
            current_user = response;

            return APIs.query_profiles_types();
          },
          function error(response) { return $q.reject(response); })
          .then(function success(response) {
            profils = _(response.data).indexBy('id') as Array<any>;

            return APIs.query_carnets_relevant_to(current_user.id);
          },
          function error(response) { })
          .then(function success(response) {
            relevant_to = _(response.data).pluck('uid_eleve');

            if (!_(relevant_to).isEmpty()) {
              APIs.get_users(relevant_to)
                .then(function success(response) {
                  concerned_people.push(_(response.data).map(function(people) {
                    let pluriel = response.data.length > 1 ? 's' : '';

                    people.type = `Autre${pluriel} élève${pluriel} suivi${pluriel}`;

                    return people;
                  }));
                },
                function error(response) { return $q.reject(response); });
            }

            return APIs.get_user(uid);
          },
          function error(response) { return $q.reject(response); })
          .then(function success(response) {
            eleve = response.data;

            eleve.type = 'Élève';
            concerned_people.push(eleve);

            if (!_(eleve.parents).isEmpty()) {
              return APIs.get_users(_(eleve.parents).pluck('parent_id'));
            } else {
              return $q.resolve({ no_parents: true });
            }
          },
          function error(response) { return $q.reject(response); })
          .then(function success(response) {
            if (_(response).has('data')) {
              concerned_people.push(_(response.data).map(function(people) {
                let pluriel = response.data.length > 1 ? 's' : '';

                people.type = `Responsable${pluriel} de l'élève`;

                return people;
              }));
            }

            if (!_(eleve.profil_actif).isUndefined()) {
              return APIs.get_structure(eleve.profil_actif.structure_id);
            } else {
              return $q.resolve({ no_profile: true });
            }
          },
          function error(response) { return $q.reject(response); })
          .then(function success(response) {
            if (_(response).has('data')) {
              personnels = _(response.data.profiles)
                .reject(function(user) {
                  return _(['ELV', 'TUT', 'ENS']).contains(user.type);
                });

              return APIs.get_users(_(personnels).pluck('user_id'));
            } else {
              return $q.resolve({ no_profile: true });
            }
          })
          .then(function success(response) {
            if (_(response).has('data')) {
              personnels = _(personnels).indexBy('user_id') as Array<any>;

              concerned_people.push(_(response.data).map(function(people) {
                people.type = `${profils[personnels[people.id].type].name} de l'élève`;

                return people;
              }));

              let groups_ids = _(eleve.groups).pluck('group_id');

              return APIs.get_groups(groups_ids);
            } else {
              return $q.resolve({ no_profile: true });
            }
          },
          function error(response) { return $q.reject(response); })
          .then(function success(response) {
            if (_(response).has('data')) {
              users = _.chain(response.data).pluck('users').flatten().value();
              pupils = _(users).where({ type: 'ELV' });

              if (pupils.length > 0) {
                return APIs.get_users(_(pupils).pluck('user_id'));
              } else {
                return $q.resolve({ no_pupils: true });
              }
            } else {
              return $q.resolve({ no_profile: true });
            }
          },
          function error(response) { return $q.reject(response); })
          .then(function success(response) {
            pupils = _(pupils).indexBy('user_id') as Array<any>;

            concerned_people.push(_(response.data).map(function(people) {
              let pluriel = response.data.length > 1 ? 's' : '';
              people.type = `Autre${pluriel} élève${pluriel}`;

              return people;
            }));

            teachers = _(users).where({ type: 'ENS' });
            if (teachers.length > 0) {
              return APIs.get_users(_(teachers).pluck('user_id'));
            } else {

            }
            return $q.resolve();
          },
          function error(response) { return $q.reject(response); })
          .then(function success(response) {
            teachers = _(teachers).indexBy('user_id') as Array<any>;
            main_teachers = _(users).where({ type: 'PRI' });

            concerned_people.push(_(response.data).map(function(people) {
              people.type = `${profils[teachers[people.id].type].name} de l'élève`;

              APIs.get_subjects(_(people.groups).pluck('subject_id'))
                .then(function(response) {
                  people.actual_subjects = response.data;
                });

              return people;
            }));

            return $q.resolve();
          },
          function error(response) { return $q.reject(response); })
          .then(function() {
            return $q.resolve(_.chain(concerned_people)
              .flatten()
              .uniq(function(people) {
                return people.id;
              })
              .value());
          });
      });
    }]);
