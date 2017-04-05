'use strict';

angular.module( 'suiviApp' )
    .component( 'droitsOnglets',
                { bindings: { uid: '<',
                              onglet: '=' },
                  template: '<ul>' +
                  '            <li ng:repeat="droit in $ctrl.droits"><droit droit="droit" uid="uid"></droit></li>' +
                  '          </ul>',
                  controller: [ 'DroitsOnglets',
                                function( DroitsOnglets ) {
                                    var ctrl = this;

                                    ctrl.$onInit = function() {
                                        DroitsOnglets.query({ uid_eleve: ctrl.uid,
                                                              onglet_id: ctrl.onglet.id }).$promise
                                            .then( function success( response ) {
                                                ctrl.droits = _(response).map( function( droit ) {
                                                    droit.read = droit.read === 1;
                                                    droit.write = droit.write === 1;

                                                    return droit;
                                                } );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
