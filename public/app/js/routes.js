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
                               { url: '/carnet/:uid',
                                 templateUrl: 'app/views/carnet.html',
                                 controller: 'CarnetCtrl' } )
                       .state( 'erreur',
                               { url: '/erreur/:code?message',
                                 templateUrl: 'app/views/erreur.html',
                                 controller: 'ErreurCtrl' } );
               } ] );
