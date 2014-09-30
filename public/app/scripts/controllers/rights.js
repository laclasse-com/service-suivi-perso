'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('RightsCtrl', ['$scope', '$state', '$stateParams', 'CurrentUser', 'GetPersonnelsEtablissements', 'Annuaire', 'Rights', function($scope, $state, $stateParams, CurrentUser, GetPersonnelsEtablissements, Annuaire, Rights) {
  CurrentUser.get().$promise.then(function(reponse){
    _.each(reponse.classes, function(classe){
      if (classe.classe_id == $stateParams.classe_id) {
        GetPersonnelsEtablissements.query({uai: classe.etablissement_code, uid_elv: $stateParams.id}).$promise.then(function(users){
          $scope.listUsersTypes = Annuaire.get_personnels(users);
        });
      };
    });
  });

  $scope.usersChanged = [];

  $scope.rights = [
    {
      type: "ELEVE ET FAMILLE",
      background: "rgba(232,194,84,0.3)",
      text: "#e8c254",
      users: []
    },
    {
      type: "COLLEGE",
      background: "rgba(26,161,204,0.3)",
      text: "#1aa1cc",
      users: []
    }
  ];

  Rights.carnets({uid_elv: $stateParams.id}).$promise.then(function(reponse){
    if (reponse.error != undefined) {alert(reponse.error); return false;};
    _.each(reponse.data, function(right){
      if (right.profil == 'élève' || right.profil == 'parent') {
        $scope.rights[0].users.push({
          id:right.id,
          id_right: right.id_right,
          full_name: right.full_name,
          profil: right.profil,
          r: right.r,
          w: right.w,
          action: []
        });
      }else{
        $scope.rights[1].users.push({
          id:right.id,
          id_right: right.id_right,
          full_name: right.full_name,
          profil: right.profil,
          r: right.r,
          w: right.w,
          action: []
        });
      };
    });
  });

  $scope.update = function(user){
    if (user.w && !user.r) {user.r=true;};
    if (_.last(user.action) != 'add' && _.last(user.action) != 'update') {
      user.action.push('update');
      $scope.addUserChanged(user);
    };
  }

  $scope.addUserChanged = function(user){
    var find = false;
    _.each($scope.usersChanged, function(u){
      if (u.id == user.id) {
        u.action = user.action;
        find = true;
      };
    });
    if (!find) {
      $scope.usersChanged.push(user);
    };
  }

  $scope.addUser=function(type, user){
    if (_.last(user.action) == 'delete') {user.action = _.initial(user.action);} else {user.action.push('add');};
    $scope.addUserChanged(user);
    if(user.profil == "parent" || user.profil == "élève"){
      $scope.rights[0].users.push(user);
    } else {
      $scope.rights[1].users.push(user);
    };
    switch(user.profil) {
      case "prof":
        $scope.listUsersTypes[1].users = _.reject($scope.listUsersTypes[1].users, function(u){
          return u.id == user.id;
        });
        break;
      case "cpe":
        $scope.listUsersTypes[2].users = _.reject($scope.listUsersTypes[2].users, function(u){
          return u.id == user.id;
        });
        break;
      case "admin":
        $scope.listUsersTypes[0].users = _.reject($scope.listUsersTypes[0].users, function(u){
          return u.id == user.id;
        });
        break;
      case "parent":
        $scope.listUsersTypes[3].users = _.reject($scope.listUsersTypes[3].users, function(u){
          return u.id == user.id;
        });
        break;
      case "élève":
        $scope.listUsersTypes[3].users = _.reject($scope.listUsersTypes[3].users, function(u){
          return u.id == user.id;
        });
        break;
      default:
        $scope.listUsersTypes[4].users = _.reject($scope.listUsersTypes[4].users, function(u){
          return u.id == user.id;
        });
    };
  };

  $scope.delUser=function(user){
    if (_.last(user.action) == 'add') {user.action = _.initial(user.action);} else {user.action.push('delete');};
    $scope.addUserChanged(user);
    switch(user.profil) {
      case "prof":
        $scope.listUsersTypes[1].users.push(user);
        break;
      case "cpe":
        $scope.listUsersTypes[2].users.push(user);
        break;
      case "admin":
        $scope.listUsersTypes[0].users.push(user);
        break;
      case "parent":
        $scope.listUsersTypes[3].users.push(user);
        break;
      case "élève":
        $scope.listUsersTypes[3].users.push(user);
        break;
      default:
        $scope.listUsersTypes[4].users.push(user);
    };
    if(user.profil == "parent" || user.profil == "élève"){
      $scope.rights[0].users = _.reject($scope.rights[0].users, function(r){
        return r.id == user.id;
      });
    } else {
      $scope.rights[1].users = _.reject($scope.rights[1].users, function(r){
        return r.id == user.id;
      });
    };
  };

  $scope.save = function(){
    // enregistrer en base
    Rights.cud({uid_elv: $stateParams.id, users: $scope.usersChanged}).$promise.then(function(reponse){
      if (reponse.error != undefined) {alert(reponse.error); return false;};
      $state.go( 'suivi.carnet', $state.params, { reload: true, inherit: true, notify: true } );      
    });
  }

  $scope.cancel = function(){
    $state.go( 'suivi.carnet', $state.params, { reload: true, inherit: true, notify: true } );
  }
}]);