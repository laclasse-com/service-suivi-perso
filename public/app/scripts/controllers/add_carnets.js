'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('AddCarnetsCtrl', ['$scope', '$state', '$stateParams', 'Carnets', 'SearchByName', 'CurrentUser', function($scope, $state, $stateParams, Carnets, SearchByName, CurrentUser) {

  SearchByName.query({name: $stateParams.name}).$promise.then(function(reponse){
    $scope.carnets = Carnets.get_by_name(reponse); 
  });

  $scope.open = function(carnet){
    if(carnet.active == false){
      Carnets.create(carnet).$promise.then(function(reponse){
        if (reponse.error != undefined) {alert(reponse.error); return false;};
        angular.forEach($scope.carnets, function (c) {
          if (c.uid_elv  == carnet.uid_elv){
            c.active = true;
            c.id = reponse.carnet_id;
          }
        });
        
      });
    } else {
      $state.go( 'suivi.carnet', {classe_id: carnet.classe_id, id: carnet.uid_elv}, { reload: true, inherit: true, notify: true } );        
    }
  }
}]);