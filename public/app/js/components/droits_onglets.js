'use strict';

angular.module( 'suiviApp' )
    .component( 'droitsOnglets',
                { bindings: { droits: '=',
                              concernedPeople: '<' },
                  templateUrl: 'app/js/components/droits_onglets.html',
                  controller: [ 'DroitsOnglets', 'APIs', 'UID', 'URL_ENT',
                                function( DroitsOnglets, APIs, UID, URL_ENT ) {
                                    var ctrl = this;

                                    var gen_pseudo_UUID = function() {
                                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                            return v.toString(16);
                                        });
                                    };

                                    ctrl.have_own_right = function() {
                                        return _.chain(ctrl.droits).findWhere({ own: true }).isUndefined();
                                    };

                                    ctrl.add = function( droit ) {
                                        droit.new = true;
                                        droit.dirty = { uid: _(droit).has('uid'),
                                                        profil_id: _(droit).has('profil_id'),
                                                        sharable_id: _(droit).has('sharable_id'),
                                                        read: true,
                                                        write: true };

                                        ctrl.droits.push( new DroitsOnglets( droit ) );
                                    };

                                    ctrl.add_sharable = function( droit ) {
                                        droit.sharable_id = gen_pseudo_UUID();
                                        ctrl.add( droit );
                                    };

                                    ctrl.$onInit = function() {
                                        ctrl.UID = UID;

                                        APIs.query_profils()
                                            .then( function success( response ) {
                                                ctrl.profils = response.data;
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
