'use strict';

angular.module( 'suiviApp' )
    .component( 'saisie',
                { bindings: { uid: '<',
                              ongletId: '<',
                              saisie: '<' },
                  template: '{{$ctrl.saisie}}',
                  controller: [ function() {
                      var ctrl = this;
                  } ]
                } );
