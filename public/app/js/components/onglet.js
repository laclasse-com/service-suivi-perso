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

                                    ctrl.saisie_callback = function( saisie ) {
                                        console.log(saisie)
                                        switch( saisie.action ) {
                                        case 'created':
                                            ctrl.saisies.push( saisie );
                                            //ctrl.saisies.unshift( { create_me: true } );
                                            break;
                                        case 'deleted':
                                            ctrl.saisies = _(ctrl.saisies).reject( function( s ) { return s.id === saisie.id; } );
                                            break;
                                        default:
                                            console.log('What to do with this?')
                                            console.log(saisie)
                                        }

                                    };

                                    ctrl.$onInit = function() {
                                        Saisies.query({ uid_eleve: ctrl.uidEleve,
                                                        onglet_id: ctrl.onglet.id }).$promise
                                            .then( function success( response ) {
                                                ctrl.saisies = ctrl.onglet.writable ? [ { create_me: true } ] : [];

                                                ctrl.saisies = ctrl.saisies.concat( response );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
