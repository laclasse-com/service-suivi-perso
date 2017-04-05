angular.module( 'suiviApp' )
    .service( 'Popups',
              [ '$uibModal', 'Onglets', 'Saisies',
                function( $uibModal, Onglets, Saisies ) {
                    var service = this;

                    service.onglet = function( uid, onglet, callback ) {
                        $uibModal.open( { resolve: { uid: function() { return uid; },
                                                     onglet: function() { return _(onglet).isNull() ? { nom: '' } : onglet; } },
                                          templateUrl: 'app/views/popup_onglet.html',
                                          controller: [ '$scope', '$uibModalInstance', 'uid', 'onglet',
                                                        function PopupOngletCtrl( $scope, $uibModalInstance, uid, onglet ) {
                                                            var ctrl = $scope;

                                                            ctrl.uid = uid;
                                                            ctrl.onglet = onglet;
                                                            ctrl.onglet.delete = false;

                                                            ctrl.ok = function() {
                                                                $uibModalInstance.close( ctrl.onglet );
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
                            .result.then( function success( new_onglet ) {
                                var promise = null;
                                if ( _(onglet).isNull() ) {
                                    promise = new Onglets({ uid_eleve: uid,
                                                            nom: new_onglet.nom })
                                        .$save();
                                } else {
                                    new_onglet.uid_eleve = uid;
                                    if ( new_onglet.delete ) {
                                        promise = new Onglets( new_onglet )
                                            .$delete();
                                    } else {
                                        promise = new Onglets( new_onglet )
                                            .$update();
                                    }
                                }
                                promise.then( function success() {
                                    callback();
                                },
                                              function error() {} );
                            }, function error() {  } );
                    };

                    service.saisie = function( uid, onglet, saisie, callback ) {
                        $uibModal.open( { resolve: { saisie: function() { return _(saisie).isNull() ? { contenu: '', background_color: '#baddad' } : saisie; } },
                                          templateUrl: 'app/views/popup_saisie.html',
                                          controller: [ '$scope', '$uibModalInstance', 'saisie',
                                                        function PopupSaisieCtrl( $scope, $uibModalInstance, saisie ) {
                                                            var ctrl = $scope;

                                                            ctrl.saisie = saisie;
                                                            ctrl.saisie.delete = false;

                                                            ctrl.ok = function() {
                                                                $uibModalInstance.close( ctrl.saisie );
                                                            };

                                                            ctrl.delete = function() {
                                                                swal({ title: 'Êtes-vous sur ?',
                                                                       text: "La saisie sera définitivement supprimée !",
                                                                       type: 'warning',
                                                                       showCancelButton: true,
                                                                       confirmButtonColor: '#3085d6',
                                                                       confirmButtonText: 'Oui, je confirme !',
                                                                       cancelButtonColor: '#d33',
                                                                       cancelButtonText: 'Annuler'
                                                                     })
                                                                    .then( function() {
                                                                        ctrl.saisie.delete = true;
                                                                        ctrl.ok();
                                                                    } );
                                                            };

                                                            ctrl.cancel = function() {
                                                                $uibModalInstance.dismiss();
                                                            };
                                                        } ] } )
                            .result.then( function success( new_saisie ) {
                                var promise = null;
                                if ( _(saisie).isNull() ) {
                                    promise = new Saisies({ uid_eleve: uid,
                                                            onglet_id: onglet.id,
                                                            contenu: new_saisie.contenu,
                                                            background_color: new_saisie.background_color })
                                        .$save();
                                } else {
                                    new_saisie.uid_eleve = uid;
                                    new_saisie.onglet_id = onglet.id;

                                    if ( new_saisie.delete ) {
                                        promise = new Saisies( new_saisie )
                                            .$delete();
                                    } else {
                                        promise = new Saisies( new_saisie )
                                            .$update();
                                    }
                                }
                                promise.then( function success( response ) {
                                    callback();
                                },
                                              function error() {} );
                            }, function error() {  } );
                    };
                } ] );
