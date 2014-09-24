'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('AsideCarnetCtrl', ['$scope', '$state', '$stateParams', 'CurrentUser', 'Annuaire', 'AVATAR_F', 'AVATAR_M', 'GetUser', 'GetRegroupement', 'APP_PATH', function($scope, $state, $stateParams, CurrentUser, Annuaire, AVATAR_F, AVATAR_M, GetUser, GetRegroupement, APP_PATH) {
  
  $scope.contactCollege = [];
  $scope.parents = [];

  GetUser.get({id: $stateParams.id}).$promise.then(function(reponse){
    $scope.user = Annuaire.get_user(reponse);
    angular.forEach(reponse.parents, function(parent){
      GetUser.get({id: parent.id_ent}).$promise.then(function(rep){
        $scope.parents.push( Annuaire.get_parent(rep));
      });
    });
  });

  GetRegroupement.get({id: $stateParams.classe_id}).$promise.then(function(reponse){
    $scope.contactCollege = Annuaire.get_contact_college(reponse.profs);
  });

  $scope.avatar_m = APP_PATH + AVATAR_M;
  $scope.avatar_f = APP_PATH + AVATAR_F;

  $scope.allNeedsClicked = function () {
    var newValue = !$scope.allNeedsMet();
    
    _.each($scope.contactCollege, function (contact) {
      contact.done = newValue;
    });
  };
  
  // Returns true if and only if all contacts are done.
  $scope.allNeedsMet = function () {
    var needsMet = _.reduce($scope.contactCollege, function (memo, contact) {
      return memo + (contact.done ? 1 : 0);
    }, 0);

    return (needsMet === $scope.contactCollege.length);
  };

  $scope.oneNeedsMet = function(datas){
    var needsMet = _.filter(datas, function(data){ return data.done == true; });
    return (needsMet.length > 0);
  }

  $scope.return = function(){
    $state.go( 'suivi.classes', {}, { reload: true, inherit: true, notify: true } );
  }

  $scope.rights = function(){
    //Faire avec l'adm du carnet.
    if (CurrentUser.get().profil_id != 'ELV') {
      $state.go( 'suivi.rights', $state.params, { reload: true, inherit: true, notify: true } );        
    };
  }
}]);