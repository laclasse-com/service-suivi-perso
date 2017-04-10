'use strict';

angular.module( 'suiviApp' )
    .component( 'carnet',
                { bindings: { uid: '<' },
                  templateUrl: 'app/js/components/carnet.html',
                  controller: [ '$uibModal', 'Carnets', 'Onglets', 'Popups',
                                function( $uibModal, Carnets, Onglets, Popups ) {
                                    var ctrl = this;
                                    ctrl.popup_onglet = Popups.onglet;
                                    ctrl.onglet_actif = 1;

                                    var activate_first_onglet = function() {
                                        _(ctrl.onglets).each( function( onglet, index ) {
                                            onglet.active = index === 0;
                                        } );
                                    };

                                    var activate_last_onglet = function() {
                                        _(ctrl.onglets).each( function( onglet, index ) {
                                            onglet.active = index === ( ctrl.onglets.length - 1 );
                                        } );
                                    };

                                    ctrl.callback_popup_onglet = function( onglet ) {
                                        if ( onglet.deleted ) {
                                            ctrl.$onInit();
                                        } else if ( onglet.created ) {
                                            ctrl.onglets.push( onglet );
                                            ctrl.onglet_actif = ctrl.onglets.length;
                                        }
                                    };

                                    ctrl.$onInit = function() {
                                        Carnets.get({ uid_eleve: ctrl.uid }).$promise
                                            .then( function success( response ) {
                                                ctrl.carnet = response;

                                                Onglets.query({ uid_eleve: ctrl.uid }).$promise
                                                    .then( function success( response ) {
                                                        ctrl.onglets = response;
                                                        activate_first_onglet();
                                                    },
                                                           function error( response ) {} );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
