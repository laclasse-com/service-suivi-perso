'use strict';

angular.module( 'suiviApp' )
    .component( 'onglet',
                { bindings: { uidEleve: '<',
                              onglet: '=' },
                  templateUrl: 'app/js/components/onglet.html',
                  controller: [ '$uibModal', '$state', 'Onglets', 'Saisies', 'Popups', 'GeneratePDF',
                                function( $uibModal, $state, Onglets, Saisies, Popups, GeneratePDF ) {
                                    var ctrl = this;

                                    ctrl.manage_onglet = Popups.onglet;
                                    ctrl.print_onglet = GeneratePDF.onglet;

                                    ctrl.callback_popup_onglet = function( onglet ) {
                                        if ( onglet.deleted ) {
                                            $state.go( 'carnet',
                                                       { uid_eleve: ctrl.uidEleve },
                                                       { reload: true } );
                                        }
                                    };

                                    ctrl.$onInit = function() {
                                        ctrl.new_saisie = { create_me: true };

                                        Saisies.query({ uid_eleve: ctrl.uidEleve,
                                                        onglet_id: ctrl.onglet.id }).$promise
                                            .then( function success( response ) {
                                                ctrl.saisies = response;
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
