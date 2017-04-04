'use strict';

angular.module( 'suiviApp' )
    .component( 'userDetails',
                { bindings: { uid: '<' },
                  template: '{{$ctrl.uid}}',
                  controller: [ 'APP_PATH', 'URL_ENT',
                                function( APP_PATH, URL_ENT ) {
                                    var ctrl = this;
                                    // FIXME
                                } ]
                } );
