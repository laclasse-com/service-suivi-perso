'use strict';

angular.module( 'suiviApp' )
    .component( 'onglet',
                { bindings: { uid: '<',
                              onglet: '<' },
                  template: 'saisies : {{$ctrl.saisies}}<ul>' +
                  '            <li ng:repeat="saisie in $ctrl.saisies">' +
                  '              <saisie uid="$ctrl.uid" onglet-id="$ctrl.onglet.id" saisie="saisie"></saisie>' +
                  '            </li>' +
                  '          </ul>',
                  controller: [ '$uibModal', 'Onglets', 'Saisies',
                                function( $uibModal, Onglets, Saisies ) {
                                    var ctrl = this;

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
