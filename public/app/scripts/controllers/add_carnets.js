'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('AddCarnetsCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'Carnets', 'SearchByName', 'CurrentUser', '$modal', function($rootScope, $scope, $state, $stateParams, Carnets, SearchByName, CurrentUser, $modal) {

  SearchByName.query({name: $stateParams.name}).$promise.then(function(reponse){
    $scope.carnets = Carnets.get_by_name(reponse); 
  });

  $scope.open = function(carnet){
    if(carnet.active == false){
      $scope.openModal(carnet);
    } else {
      $state.go( 'suivi.carnet', {classe_id: carnet.classe_id, id: carnet.uid_elv}, { reload: true, inherit: true, notify: true } );        
    }
  }

  $scope.createCarnet = function(carnet, with_model){
    Carnets.create(carnet, with_model).$promise.then(function(reponse){
      if (reponse.error != undefined) {alert(reponse.error); return false;};
      angular.forEach($scope.carnets, function (c) {
        if (c.uid_elv  == carnet.uid_elv){
          c.active = true;
          c.id = reponse.carnet_id;
        }
      });
    });
  }

  $scope.modalInstanceCreateCarnetCtrl = function ($rootScope, $scope, $modalInstance) {
    $rootScope.model_carnet = false;
    $scope.oui = function () {
      $rootScope.model_carnet = true;
      $modalInstance.close();                
    };
    $scope.non = function () {
      $rootScope.model_carnet = false;
      $modalInstance.close();                
    };
  };

  $scope.openModal = function (carnet) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalCreateCarnet.html',
      controller: $scope.modalInstanceCreateCarnetCtrl,
      size: 'sm'
    });

    modalInstance.result.then(function () {  
      $scope.createCarnet(carnet, $rootScope.model_carnet)
    });
  };
}]);