'use strict';

angular.module( 'suiviApp' )
    .component( 'droitsOnglets',
                { bindings: { uid: '<',
                              onglet: '=' },
                  templateUrl: 'app/js/components/droits_onglets.html',
                  controller: [ 'DroitsOnglets', 'UID',
                                function( DroitsOnglets, UID ) {
                                    var ctrl = this;
                                    ctrl.UID = UID;

                                    ctrl.add = function( droit ) {
                                        new DroitsOnglets( droit ).$save()
                                            .then( function success( response ) {
                                                ctrl.droits.push( response );
                                            },
                                                   function error( response ) {} );
                                    };

                                    ctrl.delete = function( droit ) {
                                        droit.uid_eleve = ctrl.uid;
                                        var post_delete = function() {
                                            ctrl.droits = _(ctrl.droits).without( droit );
                                        };

                                        if ( _(droit).has('id') ) {
                                            droit.$delete()
                                                .then( function success( response ) {
                                                    post_delete();
                                                },
                                                       function error( response ) {} );
                                        } else {
                                            post_delete();
                                        }
                                    };

                                    ctrl.save = function( droit ) {
                                        droit.uid_eleve = ctrl.uid;
                                        if ( _(droit).has('id') ) {
                                            droit.$update();
                                        } else {
                                            droit.$save();
                                        }
                                    };

                                    ctrl.$onInit = function() {
                                        DroitsOnglets.query({ uid_eleve: ctrl.uid,
                                                              onglet_id: ctrl.onglet.id }).$promise
                                            .then( function success( response ) {
                                                ctrl.droits = _(response).map( function( droit ) {
                                                    droit.uid_eleve = ctrl.uid;

                                                    return new DroitsOnglets( droit );
                                                } );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
