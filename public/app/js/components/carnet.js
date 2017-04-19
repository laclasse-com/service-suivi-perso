'use strict';

angular.module( 'suiviApp' )
    .component( 'carnet',
                { bindings: { uidEleve: '<' },
                  templateUrl: 'app/js/components/carnet.html',
                  controller: [ function(  ) {
                      var ctrl = this;

                      ctrl.$onInit = function() {};
                  } ]
                } );
