'use strict';

angular.module( 'suiviApp' )
    .component( 'saisie',
                { bindings: { uid: '<',
                              onglet: '<',
                              saisie: '<' },
                  templateUrl: 'app/js/components/saisie.html',
                  controller: [ '$sce',
                                function( $sce ) {
                                    var ctrl = this;

                                    ctrl.$onInit = function() {
                                        ctrl.saisie.trusted_contenu = $sce.trustAsHtml( ctrl.saisie.contenu );
                                    };
                                } ]
                } );
