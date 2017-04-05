'use strict';

angular.module( 'suiviApp' )
    .component( 'onglet',
                { bindings: { uid: '<',
                              onglet: '<' },
                  templateUrl: 'app/js/components/onglet.html',
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
