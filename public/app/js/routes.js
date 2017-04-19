angular.module( 'suiviApp' )
    .config( [ '$stateProvider', '$urlRouterProvider',
               function( $stateProvider, $urlRouterProvider ) {
                   $urlRouterProvider.otherwise('/');

                   // TODO: after ui-router@1.0.0, do https://ui-router.github.io/guide/ng1/route-to-component
                   $stateProvider
                       .state( 'trombinoscope',
                               { url: '/',
                                 template: '<trombinoscope></trombinoscope>' } )
                       .state( 'carnet',
                               { url: '/carnet/:uid_eleve',
                                 template: '<carnet uid-eleve="$ctrl.uidEleve"></carnet>',
                                 controller: [ '$scope', '$stateParams',
                                               function( $scope, $stateParams ) {
                                                   $scope.$ctrl = $scope;

                                                   $scope.$ctrl.uidEleve = $stateParams.uid_eleve;
                                               } ]
                               } );
               } ] );
