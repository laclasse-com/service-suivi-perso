'use strict';

angular.module( 'suiviApp' )
    .component( 'onglet',
                { bindings: { uid: '<',
                              onglet: '<' },
                  template: '<input class="btn btn-default" type="button" ng:click="$ctrl.popup_saisie( $ctrl.uid, $ctrl.onglet, null, $ctrl.$onInit )" value="+" />' +
                  '          <ul>' +
                  '            <li ng:repeat="saisie in $ctrl.saisies">' +
                  '              <saisie uid="$ctrl.uid" onglet-id="$ctrl.onglet.id" saisie="saisie"></saisie>' +
                  '            </li>' +
                  '          </ul>',
                  controller: [ '$uibModal', 'Onglets', 'Saisies', 'Popups',
                                function( $uibModal, Onglets, Saisies, Popups ) {
                                    var ctrl = this;
                                    ctrl.popup_saisie = Popups.saisie;

                                    ctrl.$onInit = function() {
                                        Saisies.query({ uid_eleve: ctrl.uid,
                                                        onglet_id: ctrl.onglet.id }).$promise
                                            .then( function success( response ) {
                                                ctrl.saisies = response;
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
