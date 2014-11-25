'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('AddCarnetsEvignalCtrl', ['$scope', '$state', '$stateParams', 'Carnets', 'EvignalSearchByName', 'CurrentUser', function($scope, $state, $stateParams, Carnets, EvignalSearchByName, CurrentUser) {
  $scope.carnets = [{id: null, couleur: null, uid_elv: null, firstName: '', lastName: '', classe: '', classe_id: null, etablissement_code: null, avatar: '', active: false}];
  EvignalSearchByName.query({name: $stateParams.name}).$promise.then(function(reponse){
    $scope.carnets = Carnets.get_by_name(reponse); 
    // console.log($scope.carnets);
  });

  $scope.open = function(carnet){
    if(carnet.active == false){
      Carnets.createEvignal(carnet).$promise.then(function(reponse){
        if (reponse.error != undefined) {alert(reponse.error); return false;};
        angular.forEach($scope.carnets, function (c) {
          if (c.uid_elv  == carnet.uid_elv){
            c.active = true;
            c.id = reponse.carnet_id;
          }
        });
        
      });
    } else {
      $state.go( 'suivi.evignal_carnet', {classe_id: carnet.classe_id, id: carnet.uid_elv}, { reload: true, inherit: true, notify: true } );        
    }
  }
}]);