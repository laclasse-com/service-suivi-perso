'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('CarnetCtrl', ['$scope', '$stateParams', '$modal', 'Onglets', 'Entrees', 'Annuaire', 'CurrentUser', 'AVATAR_M', 'AVATAR_F', 'APP_PATH', function($scope, $stateParams, $modal, Onglets, Entrees, Annuaire, CurrentUser, AVATAR_M, AVATAR_F, APP_PATH) {

  Onglets.get({uid: $stateParams.id}, function(reponse){
    console.log(reponse);
    if (reponse.error == undefined) {
      _.each(reponse.onglets, function(tab){
        _.each(tab.entrees, function(entree){
          entree.date = new Date(entree.date);
          entree.owner.avatar = APP_PATH + entree.owner.avatar;
        });
      });
      $scope.tabs = reponse.onglets;      
    } else{
      alert(reponse[0].error);
    };
  });
  
  $scope.activeTab = function(tab){
    _.each($scope.tabs, function(t){
      if (t.id == tab.id) {
        t.active = true;
      } else{
        t.active = false;
      };
    });
  };

  $scope.changeNameTab = function(tab){
    Onglets.update({id: tab.id, nom: tab.nom, ordre: tab.ordre}).$promise.then(function(reponse){
      if (reponse.error != undefined && reponse.error != null) {
        alert(reponse.error);
      } else {
        _.each($scope.tabs, function(t){
          if (t.id == tab.id) {
            t.editable = false;
          };
        });
      };
    });
  };

  $scope.addTab = function(){
    var newTab = {
      id: null,
      carnet_id: null,
      ordre: null,
      nom: "Nouvel onglet",
      editable: true,
      active: true,
      htmlcontent: "",
      modifEntree: null,
      entrees: []
    };
    Onglets.post({uid: $stateParams.id, nom: newTab.nom}).$promise.then(function(reponse){
      if (reponse.error == undefined) {
        newTab.id = reponse.id;
        newTab.carnet_id = reponse.carnet_id
        newTab.ordre = reponse.ordre
        $scope.activeTab(newTab);
        $scope.tabs.push(newTab);            
      } else {
        alert(reponse.error);
      };
    });
  };

  $scope.removeTab = function(tab){
    Onglets.delete({id: tab.id}).$promise.then(function(reponse){
      if (reponse.error != undefined && reponse.error != null) {
        alert(reponse.error);
      } else{
        $scope.tabs = _.reject($scope.tabs, function(t){
          return t.id == tab.id;
        });
      };
    });
  };

  $scope.addEntree = function(tab){
    if (tab.htmlcontent.trim()=="") {return false;};
    if (tab.modifEntree == null) {
      var avatar = AVATAR_M
      var infos = Annuaire.get_infos_of(CurrentUser.get(), $stateParams.classe_id);
      if (CurrentUser.get().sexe ==  'f') { avatar = AVATAR_F}; 
      var entree = {
        id: null,
        owner: {
          uid: CurrentUser.get().id_ent,
          infos: infos,
          avatar: avatar,
        },
        contenu: tab.htmlcontent,
        date: Date.now()
      };
      console.log(tab);
      Entrees.post({id_onglet: tab.id, carnet_id: tab.carnet_id, uid: entree.owner.uid, avatar: entree.owner.avatar, infos: entree.owner.infos, contenu: entree.contenu}).$promise.then(function(reponse){
        if (reponse.error != undefined && reponse.error != null) {
          alert(reponse.error);
        } else{
          _.each($scope.tabs, function(t){
            if (t.id == tab.id) {
              entree.id = reponse.id;
              entree.owner.avatar = APP_PATH + entree.owner.avatar
              t.entrees.push(entree);
              t.htmlcontent = "";
            };
          });
        }
      });
    } else {
      Entrees.update({id: tab.modifEntree, contenu: tab.htmlcontent}).$promise.then(function(reponse){
        _.each($scope.tabs, function(t){
          if (t.id == tab.id) {
            _.each(t.entrees, function(e){
              if (e.id == t.modifEntree) {
                e.contenu = t.htmlcontent;
                t.modifEntree = null;
                t.htmlcontent = "";
              };
            });
          };
        });
      });
    };
  };

  $scope.editEntree = function(tab, entree){
    _.each($scope.tabs, function(t){
      if (t.id == tab.id) {
        t.htmlcontent = entree.contenu;
        t.modifEntree = entree.id;
      };
    });
  }

  $scope.removedEntree = function(tab, entree){
    Entrees.delete({id: entree.id}).$promise.then(function(reponse){
      if (reponse.error != undefined && reponse.error != null) {
        alert(reponse.error);
      } else{
        _.each($scope.tabs, function(t){
          if(t.id == tab.id){
            t.entrees = _.reject(t.entrees, function(e){
              return e.id == entree.id;
            });
          }
        });
      };
    });
  };

  $scope.modalInstanceCtrl = function ($scope, $modalInstance) {

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };

  $scope.open = function (tab, entree, type) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: $scope.modalInstanceCtrl,
      size: 'sm'
    });

    modalInstance.result.then(function () {
      switch(type){
        case 'entree':
          $scope.removedEntree(tab, entree);
          break;
        case 'tab':
        $scope.removeTab(tab);
        break;
      }
    });
  };
}]);