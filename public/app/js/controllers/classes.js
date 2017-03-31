'use strict';

/* Controllers */

angular.module('suiviApp')
    .controller( 'ClassesCtrl',
                 [ '$scope', '$state', 'Annuaire', 'Classes',
                   function( $scope, $state, Annuaire, Classes ) {
                       Classes.query().$promise.then(function(response){
                           $scope.classes = Annuaire.get_classes(response);
                       });

                       $scope.open = function( classe ) {
                           $state.go( 'suivi.carnets', {classe_id: classe.id}, { reload: true, inherit: true, notify: true } );
                       };
                   }]);
