angular.module( 'suiviApp' )
    .config( [ '$stateProvider', '$urlRouterProvider',
               function( $stateProvider, $urlRouterProvider ) {
                   $urlRouterProvider.otherwise('/');

                   $stateProvider
                       .state( 'trombinoscope',
                               { url: '/',
                                 component: 'trombinoscope' } )
                       .state( 'carnet',
                               { url: '/carnet/:uid_eleve',
                                 component: 'carnet',
                                 resolve: { 'uid-eleve': function( $transition$ ) {
                                     return $transition$.params().uid_eleve;
                                 } }
                               } );
               } ] );
