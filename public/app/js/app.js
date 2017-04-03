'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'suiviApp',
                [ 'ngResource',
                  'textAngular',
                  'ui.bootstrap',
                  'ui.router' ] )
    .config( [ '$httpProvider',
               function( $httpProvider ) {
                   $httpProvider.defaults.withCredentials = true;
               }] );
