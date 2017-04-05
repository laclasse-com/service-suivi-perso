'use strict';

angular.module( 'suiviApp' )
    .component( 'carnet',
                { bindings: { uid: '<' },
                  templateUrl: 'app/js/components/carnet.html',
                  controller: [ '$uibModal', 'Carnets', 'Onglets', 'Popups',
                                function( $uibModal, Carnets, Onglets, Popups ) {
                                    var ctrl = this;

                                    ctrl.popup_onglet = Popups.onglet;

                                    ctrl.$onInit = function() {
                                        Carnets.get({ uid_eleve: ctrl.uid }).$promise
                                            .then( function success( response ) {
                                                ctrl.carnet = response;

                                                Onglets.query({ uid_eleve: ctrl.uid }).$promise
                                                    .then( function success( response ) {
                                                        ctrl.onglets = response;
                                                    },
                                                           function error( response ) {} );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
