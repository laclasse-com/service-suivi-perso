angular.module( 'suiviApp' )
    .service( 'Popups',
              [ '$uibModal', 'Onglets',
                function( $uibModal, Onglets ) {
                    var service = this;

                    service.onglet = function( uid, onglet, callback ) {
                        $uibModal.open( { resolve: { onglet: function() { return _(onglet).isNull() ? { nom: '' } : onglet; } },
                                          template: '<div class="modal-header">' +
                                          '            <h3 class="modal-title">Ajouter un onglet</h3>' +
                                          '          </div>' +
                                          '          <div class="modal-body available-apps">' +
                                          '            <input type="text" ng:model="onglet.nom" />' +
                                          '            <div class="clearfix"></div>' +
                                          '          </div>' +
                                          '          <div class="modal-footer">' +
                                          '            <button class="btn btn-danger pull-left"' +
                                          '                    ng:click="delete()"' +
                                          '                    ng:if="onglet.id">' +
                                          '              <span class="glyphicon glyphicon-trash"></span>' +
                                          '              <span> Supprimer l\'onglet</span>' +
                                          '            </button>' +
                                          '            <button class="btn btn-default"' +
                                          '                    ng:click="cancel()">' +
                                          '              <span class="glyphicon glyphicon-remove-sign"></span>' +
                                          '              <span ng:if="onglet.nom"> Annuler</span>' +
                                          '              <span ng:if="!onglet.nom"> Fermer</span>' +
                                          '            </button>' +
                                          '            <button class="btn btn-success"' +
                                          '                    ng:click="ok()"' +
                                          '                    ng:disabled="!onglet.nom">' +
                                          '              <span class="glyphicon glyphicon-ok-sign"></span> Valider' +
                                          '            </button>' +
                                          '          </div>',
                                          controller: [ '$scope', '$uibModalInstance', 'onglet',
                                                        function PopupOngletCtrl( $scope, $uibModalInstance, onglet ) {
                                                            var ctrl = $scope;

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
                } ] );