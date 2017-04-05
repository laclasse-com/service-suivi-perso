'use strict';

angular.module( 'suiviApp' )
    .component( 'droit',
                { bindings: { droit: '=' },
                  template: '<input type="text" ng:model="$ctrl.droit.uid" ng:if="$ctrl.droit.uid" />' +
                  '          <input type="text" ng:model="$ctrl.droit.profil_id" ng:if="$ctrl.droit.profil_id" />' +
                  '          <input type="checkbox" ng:model="$ctrl.droit.read" />' +
                  '          <input type="checkbox" ng:model="$ctrl.droit.write" />' +
                  '          <button ng:click="$ctrl.droit.$delete()"><span class="glyphicon glyphicon-trash"></span></button>',
                  controller: [ 'DroitsOnglets',
                                function( DroitsOnglets ) {
                                    var ctrl = this;

                                    ctrl.$onInit = function() {
                                        ctrl.droit = new DroitsOnglets( ctrl.droit );
                                    };
                                } ]
                } );
