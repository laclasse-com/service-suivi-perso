angular.module( 'suiviApp' )
    .service( 'Popups',
              [ '$uibModal', 'Onglets',
                function( $uibModal, Onglets ) {
                    var service = this;

                    service.onglet = function( uid, onglet, callback ) {
                        $uibModal.open( { resolve: { uid: function() { return uid; },
                                                     onglet: function() { return _(onglet).isNull() ? { nom: '' } : onglet; } },
                                          templateUrl: 'app/views/popup_onglet.html',
                                          controller: [ '$scope', '$uibModalInstance', '$http', '$q', 'DroitsOnglets', 'URL_ENT', 'uid', 'onglet',
                                                        function PopupOngletCtrl( $scope, $uibModalInstance, $http, $q, DroitsOnglets, URL_ENT, uid, onglet ) {
                                                            var ctrl = $scope;

                                                            ctrl.uid = uid;
                                                            ctrl.onglet = onglet;
                                                            ctrl.onglet.delete = false;

                                                            if ( _(ctrl.onglet).has('id') ) {
                                                                DroitsOnglets.query({ uid_eleve: ctrl.uid,
                                                                                      onglet_id: ctrl.onglet.id }).$promise
                                                                    .then( function success( response ) {
                                                                        ctrl.droits = _(response).map( function( droit ) {
                                                                            droit.uid_eleve = ctrl.uid;
                                                                            droit.own = droit.uid === ctrl.UID;

                                                                            return new DroitsOnglets( droit );
                                                                        } );
                                                                    },
                                                                           function error( response ) {} );
                                                            }

                                                            $http.get( URL_ENT + 'api/app/users/' + uid, { params: { expand: true } } )
                                                                .then( function success( response ) {
                                                                    ctrl.eleve = response.data;
                                                                    ctrl.concerned_people = [];
                                                                    ctrl.concerned_people.push( _([ ctrl.eleve ]).map( function( people ) {
                                                                        return { type: 'Élève',
                                                                                 uid: people.id_ent,
                                                                                 display: people.prenom + ' ' + people.nom };
                                                                    } ) );
                                                                    ctrl.concerned_people.push( _(ctrl.eleve.relations_adultes).map( function( people ) {
                                                                        return { type: 'Reponsable',
                                                                                 uid: people.id_ent,
                                                                                 display: people.prenom + ' ' + people.nom };
                                                                    } ) );

                                                                    return $q.all( _.chain( ctrl.eleve.classes.concat( ctrl.eleve.groues_eleves ) ) // add groupes_libres
                                                                                   .select( function( regroupement ) {
                                                                                       return _(regroupement).has('etablissement_code') && regroupement.etablissement_code === ctrl.eleve.profil_actif.etablissement_code_uai;
                                                                                   } )
                                                                            .map( function( regroupement ) {
                                                                                return _(regroupement).has('classe_id') ? regroupement.classe_id : regroupement.groupe_id;
                                                                            } )
                                                                            .uniq()
                                                                            .map( function( regroupement_id ) {
                                                                                return $http.get( URL_ENT + '/api/app/regroupements/' + regroupement_id, { params: { expand: 'true' } } );
                                                                            } )
                                                                                   .value() );
                                                                },
                                                                       function error( response ) {} )
                                                                .then( function success( response ) {
                                                                    ctrl.enseignants = _.chain(response)
                                                                        .pluck('data')
                                                                        .map( function( regroupement ) {
                                                                            return _(regroupement.profs)
                                                                                .map( function( people ) {
                                                                                    return { type: 'Enseignant',
                                                                                             uid: people.id_ent,
                                                                                             display: people.prenom + ' ' + people.nom + ' (' + people.matieres.map( function( matiere ) { return matiere.libelle_long; } ).join(', ') + ' )'};
                                                                                } );
                                                                        } )
                                                                        .flatten()
                                                                        .value();
                                                                    ctrl.concerned_people.push( ctrl.enseignants );

                                                                    return $http.get( URL_ENT + 'api/app/profils' );
                                                                },
                                                                       function error( response ) {} )
                                                                .then( function success( response ) {
                                                                    ctrl.profils = response.data;

                                                                    return $http.get( URL_ENT + 'api/app/etablissements/' + ctrl.eleve.profil_actif.etablissement_code_uai + '/personnel' );
                                                                },
                                                                       function error( response ) {} )
                                                                .then( function success( response ) {
                                                                    ctrl.personnels = _.chain(response.data)
                                                                        .reject( function( people ) { return people.profil_id === 'ENS'; } )
                                                                        .map( function( people ) {
                                                                            return { type: 'Personnel de l\'établissement',
                                                                                     uid: people.id_ent,
                                                                                     display: people.prenom + ' ' + people.nom + '( ' + _(ctrl.profils).findWhere({id: people.profil_id}).description + ' )'};
                                                                        } )
                                                                        .value();
                                                                    ctrl.concerned_people.push( ctrl.personnels );

                                                                    ctrl.concerned_people = _.chain(ctrl.concerned_people)
                                                                        .flatten()
                                                                        .uniq( function( people ) {
                                                                            return people.uid;
                                                                        } )
                                                                        .value();
                                                                },
                                                                       function error( response ) {} );

                                                            ctrl.ok = function() {
                                                                $uibModalInstance.close( { onglet: ctrl.onglet,
                                                                                           droits: ctrl.droits } );
                                                            };

                                                            ctrl.delete = function() {
                                                                swal({ title: 'Êtes-vous sur ?',
                                                                       text: "L'onglet ainsi que toutes les saisies et droits associés seront définitivement supprimés !",
                                                                       type: 'warning',
                                                                       showCancelButton: true,
                                                                       confirmButtonColor: '#3085d6',
                                                                       confirmButtonText: 'Oui, je confirme !',
                                                                       cancelButtonColor: '#d33',
                                                                       cancelButtonText: 'Annuler'
                                                                     })
                                                                    .then( function() {
                                                                        ctrl.onglet.delete = true;
                                                                        ctrl.ok();
                                                                    } );
                                                            };

                                                            ctrl.cancel = function() {
                                                                $uibModalInstance.dismiss();
                                                            };
                                                        } ] } )
                            .result.then( function success( response_popup ) {
                                var promise = null;
                                var action = 'rien';

                                if ( _(onglet).isNull() ) {
                                    action = 'created';

                                    promise = new Onglets({ uid_eleve: uid,
                                                            nom: response_popup.onglet.nom })
                                        .$save();
                                } else {
                                    response_popup.onglet.uid_eleve = uid;
                                    if ( response_popup.onglet.delete ) {
                                        action = 'deleted';

                                        promise = new Onglets( response_popup.onglet ).$delete();
                                    } else {
                                        promise = new Onglets( response_popup.onglet ).$update();
                                    }
                                }
                                promise.then( function success( response ) {
                                    response[ action ] = true;

                                    _.chain(response_popup.droits)
                                        .each( function( droit ) {
                                            if ( droit.to_delete ) {
                                                droit.$delete();
                                            } else if ( droit.dirty ) {
                                                droit.uid_eleve = uid;
                                                droit.onglet_id = response_popup.onglet.id;

                                                _(droit).has('id') ? droit.$update() : droit.$save();
                                            }
                                        } );

                                    callback( response );
                                },
                                              function error() {} );
                            }, function error() {  } );
                    };
                } ] );
