'use strict';

angular.module( 'suiviApp' )
    .component( 'onglet',
                { bindings: { uid: '<',
                              onglet: '<' },
                  template: '<button class="btn btn-default" type="button" ng:click="$ctrl.popup_saisie( $ctrl.uid, $ctrl.onglet, null, $ctrl.$onInit )"><span class="glyphicon glyphicon-plus-sign"></span></button>' +
                  '          <ul>' +
                  '            <li ng:repeat="saisie in $ctrl.saisies">' +
                  '              <button class="btn btn-default" type="button" ng:click="$ctrl.popup_saisie( $ctrl.uid, $ctrl.onglet, saisie, $ctrl.$onInit )"><span class="glyphicon glyphicon-edit"></span></button>' +
                  '              <saisie uid="$ctrl.uid" onglet="$ctrl.onglet" saisie="saisie"></saisie>' +
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
