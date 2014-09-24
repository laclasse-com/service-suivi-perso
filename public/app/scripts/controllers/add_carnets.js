'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('AddCarnetsCtrl', ['$scope', '$state', '$stateParams', 'Carnets', 'SearchByName', function($scope, $state, $stateParams, Carnets, SearchByName) {

  SearchByName.query({name: $stateParams.name}).$promise.then(function(reponse){
    $scope.carnets = Carnets.get_by_name(reponse);    
  });

  $scope.open = function(carnet){
    if(carnet.active == false){
      Carnets.create(carnet);
      angular.forEach($scope.carnets, function (c) {
        if (c.uid_elv  == carnet.uid_elv){
          c.active = true;
        }
      });
    } else {
      $state.go( 'suivi.carnet', {classe_id: carnet.classe_id, id: carnet.uid_elv}, { reload: true, inherit: true, notify: true } );        
    }
  }
}]);