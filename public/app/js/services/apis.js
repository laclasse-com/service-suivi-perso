angular.module( 'suiviApp' )
    .service( 'APIs',
              [ '$http', '$q', 'User', 'URL_ENT', 'APP_PATH',
                function( $http, $q, User, URL_ENT, APP_PATH ) {
                    var service = this;

                    service.query_profils = _.memoize( function() {
                        return $http.get( URL_ENT + 'api/profiles' );
                    } );

                    service.get_user = _.memoize( function( uid ) {
                        return $http.get( URL_ENT + '/api/users/' + uid, { params: { expand: 'true' } } );
                    } );

                    service.get_current_user = _.memoize( function(  ) {
                        return User.get().$promise;
                    } );

                    service.get_regroupement = _.memoize( function( regroupement_id ) {
                        return $http.get( URL_ENT + '/api/groups/' + regroupement_id, { params: { expand: 'true' } } );
                    } );

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
                                                                            uid: people.id_ent,
                                                                            nom: people.nom,
                                                                            prenom: people.prenom,
                                                                            matieres: people.matieres.map( function( matiere ) { return matiere.libelle_long; } ).join(', '),
                                                                            prof_principal: people.prof_principal === 'O' };
                                                               } )
                                                               .concat( _(regroupement.eleves)
                                                                        .map( function( people ) {
                                                                            return { type: 'Autre Élève',
                                                                                     uid: people.id_ent,
                                                                                     nom: people.nom,
                                                                                     prenom: people.prenom,
                                                                                     contributed_to: !_(['ELV', 'TUT']).contains( current_user.profil_actif.profil_id ) || _(contributed_to).contains( people.id_ent ) };
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
                                                       .reject( function( people ) { return people.profil_id === 'ENS'; } )
                                                       .map( function( people ) {
                                                           return { type: _(profils).findWhere({id: people.profil_id}).description,
                                                                    uid: people.id_ent,
                                                                    nom: people.nom,
                                                                    prenom: people.prenom,
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
