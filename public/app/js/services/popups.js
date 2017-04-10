angular.module( 'suiviApp' )
    .service( 'Popups',
              [ '$uibModal', 'Onglets',
                function( $uibModal, Onglets ) {
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
                                var action = 'rien';

                                if ( _(onglet).isNull() ) {
                                    action = 'created';

                                    promise = new Onglets({ uid_eleve: uid,
                                                            nom: new_onglet.nom })
                                        .$save();
                                } else {
                                    new_onglet.uid_eleve = uid;
                                    if ( new_onglet.delete ) {
                                        action = 'deleted';

                                        promise = new Onglets( new_onglet )
                                            .$delete();
                                    } else {
                                        promise = new Onglets( new_onglet )
                                            .$update();
                                    }
                                }
                                promise.then( function success( response ) {
                                    response[ action ] = true;

                                    callback( response );
                                },
                                              function error() {} );
                            }, function error() {  } );
                    };
                } ] );
