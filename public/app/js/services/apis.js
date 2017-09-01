angular.module( 'suiviApp' )
    .service( 'APIs',
              [ '$http', '$q', 'User', 'URL_ENT', 'APP_PATH',
                function( $http, $q, User, URL_ENT, APP_PATH ) {
                    var APIs = this;

                    APIs.query_profiles_types = _.memoize( function() {
                        return $http.get( URL_ENT + '/api/profiles_types' );
                    } );

                    APIs.get_user = _.memoize( function( user_id ) {
                        return $http.get( URL_ENT + '/api/users/' + user_id )
                            .then( function( response ) {
                                response.data.profil_actif = _(response.data.profiles).findWhere( { active: true } );
                                if ( _(response.data.profil_actif).isUndefined() && !_(response.data.profiles).isEmpty() ) {
                                    response.data.profil_actif = _(response.data.profiles).first();
                                }

                                response.data.get_actual_groups = function() {
                                    return APIs.get_groups( _(response.data.groups).pluck('group_id') )
                                        .then( function( groups ) {
                                            return $q.resolve( groups.data );
                                        } );
                                };

                                response.data.get_actual_subjects = function() {
                                    return APIs.get_subjects( _(response.data.groups).pluck('subject_id') )
                                        .then( function( subjects ) {
                                            return $q.resolve( subjects.data );
                                        } );
                                };

                                return response;
                            } );
                    } );

                    APIs.get_current_user = _.memoize( function(  ) {
                        return User.get().$promise;
                    } );

                    APIs.get_users = _.memoize( function( users_ids ) {
                        if ( _(users_ids).isEmpty() ) {
                            return $q.resolve([]);
                        } else {
                            return $http.get( URL_ENT + '/api/users/', { params: { 'id[]': users_ids } } );
                        }
                    });

                    APIs.get_current_user_groups = _.memoize( function() {
                        return APIs.get_current_user().then( function success( current_user ) {
                            var groups_ids = _.chain(current_user.groups).pluck( 'group_id' ).uniq().value();
                            var promise = $q.resolve([]);
                            if ( _( [ 'EVS', 'DIR', 'ADM' ] ).contains( current_user.profil_actif.type ) || current_user.profil_actif.admin ) {
                                promise = APIs.get_groups_of_structures( [ current_user.profil_actif.structure_id ] );
                            } else {
                                promise = APIs.get_groups( groups_ids );
                            }

                            return promise
                                .then( function( groups ) {
                                    current_user.actual_groups = _(groups.data).select( function( group ) {
                                        return group.structure_id === current_user.profil_actif.structure_id;
                                    } );

                                    return $q.resolve( current_user.actual_groups );
                                } );
                        } );
                    } );

                    APIs.get_group = _.memoize( function( regroupement_id ) {
                        return $http.get( URL_ENT + '/api/groups/' + regroupement_id );
                    } );

                    APIs.get_groups = _.memoize( function( groups_ids ) {
                        return $http.get( URL_ENT + '/api/groups/', { params: { 'id[]': groups_ids } } );
                    });

                    APIs.get_groups_of_structures = _.memoize( function( structures_ids ) {
                        return $http.get( URL_ENT + '/api/groups/', { params: { 'structure_id[]': structures_ids } } );
                    });

                    APIs.get_subjects = _.memoize( function( subjects_ids ) {
                        return $http.get( URL_ENT + '/api/subjects/', { params: { 'id[]': subjects_ids } } );
                    });

                    APIs.query_carnets_contributed_to = function( uid ) {
                        return $http.get( APP_PATH + '/api/carnets/contributed/' + uid );
                    };

                    APIs.get_structure = _.memoize( function( uai ) {
                        return $http.get( URL_ENT + '/api/structures/' + uai );
                    } );

                    APIs.query_people_concerned_about = _.memoize( function( uid ) {
                        var eleve = null;
                        var concerned_people = [];
                        var profils = [];
                        var contributed_to = [];
                        var current_user = null;

                        return APIs.get_current_user()
                            .then( function success( response ) {
                                current_user = response;

                                return APIs.query_carnets_contributed_to( current_user.id );
                            },
                                   function error( response ) {} )
                            .then( function success( response ) {
                                contributed_to = _(response.data).pluck('uid_eleve');

                                return APIs.query_profiles_types();
                            },
                                   function error( response ) {} )
                            .then( function success( response ) {
                                profils = _(response.data).indexBy('id');

                                return APIs.get_user( uid );
                            },
                                   function error( response ) {} )
                            .then( function success( response ) {
                                eleve = response.data;

                                eleve.type = 'Élève';
                                concerned_people.push( eleve );
                                var promises = [];

                                if ( !_(eleve.parents).isEmpty() ){
                                    promises.push( APIs.get_users( _(eleve.parents).pluck('parent_id') )
                                               .then( function success( response ) {
                                                   concerned_people.push( _(response.data).map( function( people ) {
                                                       people.type = 'Responsable';
                                                       return people;
                                                   } ) );
                                               },
                                                      function error( response ) {} ) );
                                }

                                if ( !_(eleve.profil_actif).isUndefined() ) {
                                    promises.push( APIs.get_structure( eleve.profil_actif.structure_id )
                                               .then( function success( response ) {
                                                   var personnels = _(response.data.profiles)
                                                       .reject( function( user ) {
                                                           return _([ 'ELV', 'TUT', 'ENS' ]).contains( user.type );
                                                       } );

                                                   return APIs.get_users( _(personnels).pluck('user_id') )
                                                       .then( function success( response ) {
                                                           personnels = _(personnels).indexBy('user_id');

                                                           concerned_people.push( _(response.data).map( function( people ) {
                                                               people.type = profils[ personnels[ people.id ].type ].name;

                                                               return people;
                                                           } ) );
                                                       },
                                                              function error( response ) {} );
                                               },
                                                      function error( response ) {} ) );

                                    var groups_ids = _(eleve.groups).pluck('group_id');
                                    promises.push( APIs.get_groups( groups_ids )
                                                   .then( function success( response ) {
                                                       var users = _.chain(response.data).pluck('users').flatten().value();
                                                       var pupils = _(users).where({ type: 'ELV' });
                                                       var teachers = _(users).where({ type: 'ENS' });
                                                       var main_teachers = _(users).where({ type: 'PRI' });

                                                       if ( pupils.length > 0 ) {
                                                           APIs.get_users( _(pupils).pluck('user_id') )
                                                               .then( function success( response ) {
                                                                   pupils = _(pupils).indexBy('user_id');

                                                                   concerned_people.push( _(response.data).map( function( people ) {
                                                                       people.type = 'Autre élève';

                                                                       return people;
                                                                   } ) );
                                                               },
                                                                      function error( response ) {} );
                                                       }

                                                       if ( teachers.length > 0 ) {
                                                           APIs.get_users( _(teachers).pluck('user_id') )
                                                               .then( function success( response ) {
                                                                   teachers = _(teachers).indexBy('user_id');

                                                                   concerned_people.push( _(response.data).map( function( people ) {
                                                                       people.type = profils[ teachers[ people.id ].type ].name;

                                                                       APIs.get_subjects( _(people.groups).pluck('subject_id') )
                                                                           .then( function( response ) {
                                                                               people.actual_subjects = response.data;
                                                                           } );

                                                                       return people;
                                                                   } ) );
                                                               },
                                                                      function error( response ) {} );
                                                       }
                                                   },
                                                          function error( response ) {} ) );
                                }

                                return $q.all( promises )
                                    .then( function() {
                                        return $q.resolve( _.chain(concerned_people)
                                                           .flatten()
                                                           .uniq( function( people ) {
                                                               return people.id;
                                                           } )
                                                           .value() );
                                    } );
                            },
                                   function error( response ) {} );
                    } );
                } ] );
