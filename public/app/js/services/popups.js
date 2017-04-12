angular.module( 'suiviApp' )
    .service( 'Popups',
              [ '$uibModal', 'Onglets',
                function( $uibModal, Onglets ) {
                    var service = this;

                    service.onglet = function( uid, onglet, callback ) {
                        $uibModal.open( { resolve: { uid: function() { return uid; },
                                                     onglet: function() { return _(onglet).isNull() ? { nom: '' } : onglet; } },
                                          templateUrl: 'app/views/popup_onglet.html',
                                          controller: [ '$scope', '$uibModalInstance', '$q', 'DroitsOnglets', 'APIs', 'URL_ENT', 'uid', 'onglet',
                                                        function PopupOngletCtrl( $scope, $uibModalInstance, $q, DroitsOnglets, APIs, URL_ENT, uid, onglet ) {
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

                                                            APIs.get_user( uid )
                                                                .then( function success( response ) {
                                                                    ctrl.eleve = response.data;
                                                                    APIs.query_people_concerned_about( uid )
                                                                        .then( function success( response ) {
                                                                            console.log(response)
                                                                            ctrl.concerned_people = response;
                                                                        },
                                                                               function error( response ) {} );
                                                                } );

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
