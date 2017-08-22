angular.module( 'suiviApp' )
    .service( 'APIs',
              [ '$http', '$q', 'User', 'URL_ENT', 'APP_PATH',
                function( $http, $q, User, URL_ENT, APP_PATH ) {
                    var service = this;

                    service.query_profiles_types = _.memoize( function() {
                        return $http.get( URL_ENT + '/' + 'api/profiles_types' );
                    } );

                    service.get_user = _.memoize( function( user_id ) {
                        return $http.get( URL_ENT + '/api/users/' + user_id )
                            .then( function( response ) {
                                response.data.profil_actif = _(response.data.profiles).findWhere( { active: true } );

                                response.data.get_actual_groups = function() {
                                    return service.get_groups( _(response.data.groups).pluck('group_id') )
                                        .then( function( groups ) {
                                            return $q.resolve( groups.data );
                                        } );
                                };

                                response.data.get_actual_subjects = function() {
                                    return service.get_subjects( _(response.data.groups).pluck('subject_id') )
                                        .then( function( subjects ) {
                                            return $q.resolve( subjects.data );
                                        } );
                                };

                                return response;
                            } );
                    } );

                    service.get_current_user = _.memoize( function(  ) {
                        return User.get().$promise;
                    } );

                    service.get_users = _.memoize( function( users_ids ) {
                        return $http.get( URL_ENT + '/api/users/', { params: { 'id[]': users_ids } } );
                    });

                    service.get_current_user_groups = _.memoize( function() {
                        return service.get_current_user().then( function success( current_user ) {
                            var groups_ids = _.chain(current_user.groups).pluck( 'group_id' ).uniq().value();
                            var promise = $q.resolve([]);
                            if ( _( [ 'EVS', 'DIR', 'ADM' ] ).contains( current_user.profil_actif.type ) || current_user.profil_actif.admin ) {
                                promise = service.get_groups_of_structures( [ current_user.profil_actif.structure_id ] );
                            } else {
                                promise = service.get_groups( groups_ids );
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

                    service.get_group = _.memoize( function( regroupement_id ) {
                        return $http.get( URL_ENT + '/api/groups/' + regroupement_id );
                    } );

                    service.get_groups = _.memoize( function( groups_ids ) {
                        return $http.get( URL_ENT + '/api/groups/', { params: { 'id[]': groups_ids } } );
                    });

                    service.get_groups_of_structures = _.memoize( function( structures_ids ) {
                        return $http.get( URL_ENT + '/api/groups/', { params: { 'structure_id[]': structures_ids } } );
                    });

                    service.query_carnets_contributed_to = function( uid ) {
                        return $http.get( APP_PATH + '/api/carnets/contributed/' + uid );
                    };

                    service.query_etablissement_personnel = _.memoize( function( uai ) {
                        return $http.get( URL_ENT + 'api/structures/' + uai + '/personnel' );
                    } );

                    service.query_people_concerned_about = _.memoize( function( uid ) {
                        var eleve = null;
                        var concerned_people = [];
                        var profils = [];
                        var contributed_to = [];
                        var current_user = null;

                        return service.get_current_user()
                            .then( function success( response ) {
                                current_user = response;

                                return service.query_carnets_contributed_to( current_user.id );
                            },
                                   function error( response ) {} )
                            .then( function success( response ) {
                                contributed_to = _(response.data).pluck('uid_eleve');

                                return service.get_user( uid );
                            },
                                   function error( response ) {} )
                            .then( function success( response ) {
                                eleve = response.data;

                                concerned_people.push( { type: 'Élève',
                                                         uid: eleve.id,
                                                         nom: eleve.lastname,
                                                         prenom: eleve.firstname } );

                                concerned_people.push( _(eleve.relations_adultes).map( function( people ) {
                                    return { type: 'Reponsable',
                                             uid: people.id,
                                             nom: people.lastname,
                                             prenom: people.firstname };
                                } ) );

                                return $q.all( _.chain( eleve.classes.concat( eleve.groupes_eleves ) ) // add groupes_libres
                                               .select( function( regroupement ) { return _(regroupement).has('etablissement_code') && regroupement.etablissement_code === eleve.profil_actif.etablissement_code_uai; } )
                                               .map( function( regroupement ) { return _(regroupement).has('classe_id') ? regroupement.classe_id : regroupement.groupe_id; } )
                                               .uniq()
                                               .map( function( regroupement_id ) { return service.get_regroupement( regroupement_id ); } )
                                               .value() );
                            },
                                   function error( response ) {} )
                            .then( function success( response ) {
                                concerned_people.push( _.chain(response)
                                                       .pluck('data')
                                                       .map( function( regroupement ) {
                                                           return _(regroupement.profs)
                                                               .map( function( people ) {
                                                                   return { type: 'Enseignant',
                                                                            uid: people.id,
                                                                            nom: people.lastname,
                                                                            prenom: people.firstname,
                                                                            matieres: people.matieres.map( function( matiere ) { return matiere.libelle_long; } ).join(', '),
                                                                            prof_principal: people.prof_principal === 'O' };
                                                               } )
                                                               .concat( _(regroupement.eleves)
                                                                        .map( function( people ) {
                                                                            return { type: 'Autre Élève',
                                                                                     uid: people.id,
                                                                                     nom: people.lastname,
                                                                                     prenom: people.firstname,
                                                                                     contributed_to: !_(['ELV', 'TUT']).contains( current_user.profil_actif.type ) || _(contributed_to).contains( people.id ) };
                                                                        } ) );
                                                       } )
                                                       .flatten()
                                                       .value() );

                                return service.query_profils();
                            },
                                   function error( response ) {} )
                            .then( function success( response ) {
                                profils = response.data;

                                return service.query_etablissement_personnel( eleve.profil_actif.etablissement_code_uai );
                            },
                                   function error( response ) {} )
                            .then( function success( response ) {
                                concerned_people.push( _.chain(response.data)
                                                       .reject( function( people ) { return people.type === 'ENS'; } )
                                                       .map( function( people ) {
                                                           return { type: _(profils).findWhere({id: people.type}).description,
                                                                    uid: people.id,
                                                                    nom: people.lastname,
                                                                    prenom: people.firstname,
                                                                    email: people.email_principal };
                                                       } )
                                                       .value() );

                                return $q.resolve( _.chain(concerned_people)
                                                   .flatten()
                                                   .uniq( function( people ) {
                                                       return people.uid;
                                                   } )
                                                   .value() );
                            },
                                   function error( response ) {} );
                    } );
                } ] );
