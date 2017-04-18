angular.module( 'suiviApp' )
    .controller( 'CarnetCtrl',
                 [ '$scope', '$stateParams',
                   function( $scope, $stateParams ) {
                       var ctrl = $scope;

                       ctrl.uid_eleve = $stateParams.uid_eleve;
                   } ] );
