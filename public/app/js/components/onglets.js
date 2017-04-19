'use strict';

angular.module( 'suiviApp' )
    .component( 'onglets',
                { bindings: { uidEleve: '<' },
                  templateUrl: 'app/js/components/onglets.html',
                  controller: [ '$uibModal', 'Carnets', 'Onglets', 'Popups',
                                function( $uibModal, Carnets, Onglets, Popups ) {
                                    var ctrl = this;
                                    ctrl.popup_onglet = Popups.onglet;

                                    ctrl.callback_popup_onglet = function( onglet ) {
                                        ctrl.onglets.push( onglet );
                                    };

                                    ctrl.$onInit = function() {
                                        Carnets.get({ uid_eleve: ctrl.uidEleve }).$promise
                                            .then( function success( response ) {
                                                ctrl.carnet = response;

                                                Onglets.query({ uid_eleve: ctrl.uidEleve }).$promise
                                                    .then( function success( response ) {
                                                        ctrl.onglets = response;
                                                    },
                                                           function error( response ) {} );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
