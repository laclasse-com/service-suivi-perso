'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('RightsEvignalCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'CurrentUser', 'GetPersonnelsEtablissements', 'GetPersonnelsEvignal', 'Annuaire', 'Rights', '$modal', '$window', 'UAI_EVIGNAL', 'Profil', function($rootScope, $scope, $state, $stateParams, CurrentUser, GetPersonnelsEtablissements, GetPersonnelsEvignal, Annuaire, Rights, $modal, $window, UAI_EVIGNAL, Profil) {
  Profil.initRights($stateParams.id).promise.then(function(){
    CurrentUser.get().$promise.then(function(reponse){
      _.each(reponse.classes, function(classe){
        if (classe.classe_id == $stateParams.classe_id) {
          GetPersonnelsEtablissements.query({uai: classe.etablissement_code, uid_elv: $stateParams.id}).$promise.then(function(users){
            $scope.listUsersTypes = Annuaire.get_personnels(users);
          });
        };
      });
    });

    if (CurrentUser.getRights().admin != 1) {$state.go( 'erreur', {code: '401', message: null}, { reload: true, inherit: true, notify: true } );};
    $scope.publique = CurrentUser.getRights().url_pub;

    $scope.isEvignal = $window.sessionStorage.getItem("evignal");
    if ($window.sessionStorage.getItem("evignal")=="true") {
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
        },
        {
          type: "HÔPITAL",
          background: "rgba(156, 117, 171, 0.3)",
          text: "#9c75ab",
          users: []
        }
      ];

      Rights.carnets({uid_elv: $stateParams.id, evignal: 1}).$promise.then(function(reponse){
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
              admin: right.admin,
              evignal: true,
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
              admin: right.admin,
              evignal: true,
              action: []
            });          
          };
        });
      });
    }else {
      GetPersonnelsEvignal.query({uai: UAI_EVIGNAL, uid_elv: $stateParams.id}).$promise.then(function(users){
        $scope.listUsersEvignalTypes = Annuaire.get_personnels(users);
      });

      GetPersonnelsEtablissements.query({uai: $window.sessionStorage.getItem("uai_etab_elv"), uid_elv: $stateParams.id}).$promise.then(function(users){
        $scope.listUsersTypes = Annuaire.get_personnels(users);
      });

      $scope.rights = [
        {
          type: "ELEVE ET FAMILLE",
          background: "rgba(232,194,84,0.3)",
          text: "#e8c254",
          users: []
        },
        {
          type: "COLLEGE DE L'ELEVE",
          background: "rgba(26,161,204,0.3)",
          text: "#1aa1cc",
          users: []
        },
        {
          type: "COLLEGE ELIE VIGNAL",
          background: "rgba(128, 186, 102, 0.3)",
          text: "#80ba66",
          users: []
        },
        {
          type: "HÔPITAL",
          background: "rgba(156, 117, 171, 0.3)",
          text: "#9c75ab",
          users: []
        }
      ];

      Rights.carnets({uid_elv: $stateParams.id, evignal: -1}).$promise.then(function(reponse){
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
              admin: right.admin,
              action: []
            });
          }else{
            if (right.evignal == true && right.hopital == false) {
              $scope.rights[2].users.push({
                id:right.id,
                id_right: right.id_right,
                full_name: right.full_name,
                profil: right.profil,
                r: right.r,
                w: right.w,
                admin: right.admin,
                evignal: right.evignal,
                hopital: right.hopital,
                action: []
              });
            } else if(right.hopital == true){
              $scope.rights[3].users.push({
                id:right.id,
                id_right: right.id_right,
                full_name: right.full_name,
                profil: right.profil,
                r: right.r,
                w: right.w,
                admin: right.admin,
                evignal: right.evignal,
                hopital: right.hopital,
                action: []
              });
            }else {
              $scope.rights[1].users.push({
                id:right.id,
                id_right: right.id_right,
                full_name: right.full_name,
                profil: right.profil,
                r: right.r,
                w: right.w,
                admin: right.admin,
                action: []
              });
            };
          };
        });
      });
    };

    $scope.usersChanged = [];

    

    $scope.update = function(user){
      console.log(user);
      if (user.admin && !user.w) {user.w=true;};
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
          u.read = user.read;
          u.write = user.write;
          u.admin = user.admin;
          u.hopital = user.hopital;
          u.evignal = user.evignal;
          u.action = user.action;
          find = true;
        };
      });
      if (!find) {
        $scope.usersChanged.push(user);
      };
    }

    $scope.addUser=function(user){
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

    $scope.addUserEvignal=function(user, type){
      console.log(type);
      if (_.last(user.action) == 'delete') {user.action = _.initial(user.action);} else {user.action.push('add');};
      $scope.addUserChanged(user);
      if(type == "evignal"){
        user.evignal = true;
        $scope.rights[2].users.push(user);
      } else {
        user.evignal = true;
        user.hopital = true;
        $scope.rights[3].users.push(user);
      };
      switch(user.profil) {
        case "prof":
          $scope.listUsersEvignalTypes[1].users = _.reject($scope.listUsersEvignalTypes[1].users, function(u){
            return u.id == user.id;
          });
          break;
        case "cpe":
          $scope.listUsersEvignalTypes[2].users = _.reject($scope.listUsersEvignalTypes[2].users, function(u){
            return u.id == user.id;
          });
          break;
        case "admin":
          $scope.listUsersEvignalTypes[0].users = _.reject($scope.listUsersEvignalTypes[0].users, function(u){
            return u.id == user.id;
          });
          break;
        case "parent":
          $scope.listUsersEvignalTypes[3].users = _.reject($scope.listUsersEvignalTypes[3].users, function(u){
            return u.id == user.id;
          });
          break;
        case "élève":
          $scope.listUsersEvignalTypes[3].users = _.reject($scope.listUsersEvignalTypes[3].users, function(u){
            return u.id == user.id;
          });
          break;
        default:
          $scope.listUsersEvignalTypes[4].users = _.reject($scope.listUsersEvignalTypes[4].users, function(u){
            return u.id == user.id;
          });
      };
    };

    $scope.delUser=function(user){
      if (user.hopital == true || user.evignal == true) {
        $scope.delUserEvignal(user)
      } else{ 
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
    };

    $scope.delUserEvignal=function(user){
      if (_.last(user.action) == 'add') {user.action = _.initial(user.action);} else {user.action.push('delete');};
      var hopital = user.hopital;
      if (user.hopital == true) {
        user.hopital = false;
      };
      $scope.addUserChanged(user);
      switch(user.profil) {
        case "prof":
          $scope.listUsersEvignalTypes[1].users.push(user);
          break;
        case "cpe":
          $scope.listUsersEvignalTypes[2].users.push(user);
          break;
        case "admin":
          $scope.listUsersEvignalTypes[0].users.push(user);
          break;
        case "parent":
          $scope.listUsersEvignalTypes[3].users.push(user);
          break;
        case "élève":
          $scope.listUsersEvignalTypes[3].users.push(user);
          break;
        default:
          $scope.listUsersEvignalTypes[4].users.push(user);
      };
      if(hopital == false){
        $scope.rights[2].users = _.reject($scope.rights[2].users, function(r){
          return r.id == user.id;
        });
      } else {
        $scope.rights[3].users = _.reject($scope.rights[3].users, function(r){
          return r.id == user.id;
        });
      };
    };

    $scope.save = function(){
      // enregistrer en base
      Rights.cud({uid_elv: $stateParams.id, users: $scope.usersChanged}).$promise.then(function(reponse){
        if (reponse.error != undefined) {alert(reponse.error); return false;};
        $state.go( 'suivi.evignal_carnet', $state.params, { reload: true, inherit: true, notify: true } );      
      });
    }

    $scope.cancel = function(){
      $state.go( 'suivi.evignal_carnet', $state.params, { reload: true, inherit: true, notify: true } );
    }

    $scope.modalInstanceRightsCtrl = function ($rootScope, $scope, $modalInstance) {
      $scope.add = function (type) {
        $rootScope.add_type = type;
        $modalInstance.close();                
      };
    };

    $scope.openAdd = function (contact) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalRightsContent.html',
        controller: $scope.modalInstanceRightsCtrl,
        size: 'sm'
      });

      modalInstance.result.then(function () {
        $scope.addUserEvignal(contact, $rootScope.add_type);
      });
    };
  });
}]);