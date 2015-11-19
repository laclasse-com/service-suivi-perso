'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('AsideEvignalCtrl', ['$scope', '$state', '$stateParams', 'CurrentUser', function($scope, $state, $stateParams, CurrentUser) {

  $scope.nameElv = $stateParams.name;
  $scope.erreur = "";
  $scope.accueil = "carnets"

  $scope.return = function(){
    $state.go( 'suivi.evignal_carnets', {}, { reload: true, inherit: true, notify: true } );
  };

  $scope.search = function(name){
    if(name != null && name != "" && name.length > 2){
      $state.go( 'suivi.evignal_add', {name: name}, { reload: true, inherit: true, notify: true } );
    } else {
      $scope.erreur = "Au minimum trois caractères sont nécessaire pour effectuer une recherche !";
    }
  }

  $scope.stats = function(){
    $state.go( 'suivi.evignal_stats', {}, { reload: true, inherit: true, notify: true } );
  };
  
  if ($state.current.name == 'suivi.evignal_carnets') {
    $scope.backClassesDisplay = false;
  }else{
    $scope.backClassesDisplay = true;
  };

  if ($state.current.name == 'suivi.evignal_stats') {
    $scope.statsDisplay = false;
  }else{
    if (CurrentUser.get() != null) {
      $scope.statsDisplay = ["DIR_ETB", "ADM_ETB", "TECH"].indexOf(CurrentUser.get().hight_role) != -1 ;      
    } else {
      $scope.statsDisplay = true;
    };
  };

  $scope.delSearch = function(){
    $scope.nameElv ="";
    $scope.erreur = "";
    $state.go( 'suivi.evignal_carnets', {}, { reload: true, inherit: true, notify: true } );
  }

}]);