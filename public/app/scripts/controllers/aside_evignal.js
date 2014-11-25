'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('AsideEvignalCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {

  $scope.nameElv = $stateParams.name;
  $scope.erreur = "";

  $scope.search = function(name){
    if(name != null && name != "" && name.length > 2){
      $state.go( 'suivi.evignal_add', {name: name}, { reload: true, inherit: true, notify: true } );
    } else {
      $scope.erreur = "Au minimum trois caractères sont nécessaire pour effectuer une recherche !";
    }
  }

  $scope.delSearch = function(){
    $scope.nameElv ="";
    $scope.erreur = "";
    $state.go( 'suivi.evignal_carnets', {}, { reload: true, inherit: true, notify: true } );
  }

}]);