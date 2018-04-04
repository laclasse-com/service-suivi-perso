'use strict';

angular.module('suiviApp')
  .factory('User',
    ['$resource', '$rootScope', '$q', 'APIs', 'URL_ENT',
      function($resource, $rootScope, $q, APIs, URL_ENT) {
        return $resource(`${URL_ENT}/api/users/:id`,
          {
            id: "@id",
            expand: "@expand"
          },
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


                user.query_people_concerned_about = _.memoize(function() {
                  let concerned_people: Array<any> = new Array<any>();
                  let profils: Array<any> = new Array<any>();
                  let relevant_to: Array<any> = new Array<any>();
                  let current_user = null;
                  let users: Array<any> = new Array<any>();
                  let personnels: Array<any> = new Array<any>();
                  let pupils: Array<any> = new Array<any>();
                  let teachers: Array<any> = new Array<any>();
                  let main_teachers: Array<any> = new Array<any>();

                  return APIs.query_profiles_types()
                    .then(function success(response) {
                      profils = _(response.data).indexBy('id') as Array<any>;

                      if (!_(user.parents).isEmpty()) {
                        return APIs.get_users(_(user.parents).pluck('parent_id'));
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

                      if (user.profiles.length > 0) {
                        return APIs.get_structures(_(user.profiles).pluck("structure_id"));
                      } else {
                        return $q.resolve({ no_profile: true });
                      }
                    },
                      function error(response) { return $q.reject(response); })
                    .then(function success(response) {
                      if (_(response).has('data')) {
                        personnels = _.chain(response.data)
                          .pluck("profiles")
                          .flatten()
                          .reject(function(user) {
                            return _(['ELV', 'TUT', 'ENS']).contains(user.type);
                          })
                          .uniq((user) => { return user.id; })
                          .value();

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

                        let groups_ids = _(user.groups).pluck('group_id');

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

                return user;
              }
            }
          });
      }]);
