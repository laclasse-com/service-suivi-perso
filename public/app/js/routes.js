angular.module( 'suiviApp' )
    .config( [ '$stateProvider', '$urlRouterProvider',
               function( $stateProvider, $urlRouterProvider ) {
                   $urlRouterProvider.otherwise('/');

                   $stateProvider
                       .state( 'trombinoscope',
                               { url: '/',
                                 templateUrl: 'app/views/trombinoscope.html',
                                 controller: 'TrombinoscopeCtrl' } )
                       .state( 'carnet',
                               { url: '/carnet/:uid_eleve',
                                 templateUrl: 'app/views/carnet.html',
                                 controller: 'CarnetCtrl' } );
               } ] );
