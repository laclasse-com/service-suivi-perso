'use strict';

angular.module( 'suiviApp' )
    .component( 'droit',
                { bindings: { uid: '<',
                              droit: '=' },
                  template: '<input type="text" ng:model="$ctrl.droit.uid" ng:if="$ctrl.droit.uid" />' +
                  '          <input type="text" ng:model="$ctrl.droit.profil_id" ng:if="$ctrl.droit.profil_id" />' +
                  '          <input type="checkbox" ng:model="$ctrl.droit.read" />' +
                  '          <input type="checkbox" ng:model="$ctrl.droit.write" />',
                  controller: [ '$uibModal',
                                function( $uibModal ) {
                                    var ctrl = this;

                                    ctrl.$onInit = function() {};
                                } ]
              } );
