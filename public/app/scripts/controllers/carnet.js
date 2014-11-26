'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('CarnetCtrl', ['$scope', '$stateParams', '$modal', 'Onglets', 'Entrees', 'Carnets', 'Annuaire', 'CurrentUser', 'AVATAR_DEFAULT', 'AVATAR_M', 'AVATAR_F', 'LACLASSE_PATH','Rights', '$state', 'Profil', '$window', function($scope, $stateParams, $modal, Onglets, Entrees, Carnets, Annuaire, CurrentUser, AVATAR_DEFAULT, AVATAR_M, AVATAR_F, LACLASSE_PATH, Rights, $state, Profil, $window) {

  
  Profil.initRights($stateParams.id).promise.then(function(){


    Onglets.get({uid: $stateParams.id}, function(reponse){
      if (reponse.error == undefined) {
        var avatars = Annuaire.avatars(reponse.onglets[0].entrees);
        _.each(reponse.onglets, function(tab){
          _.each(tab.entrees, function(entree){
            entree.date = new Date(entree.date);
            entree.owner.avatar = LACLASSE_PATH + '/' + avatars[entree.owner.uid];
          });
        });
        $scope.tabs = reponse.onglets;
        avatars.$promise.then(function(reponse){
          _.each($scope.tabs, function(tab){
            _.each(tab.entrees, function(entree){
              entree.owner.avatar = LACLASSE_PATH + '/' + reponse[entree.owner.uid];
            });
          });
        });
        $scope.nameUser = $window.sessionStorage.getItem("prenom") + " " + $window.sessionStorage.getItem("nom"); 
      } else{
        alert(reponse.error);
      };
    });

    $scope.activeTab = function(tab){
      _.each($scope.tabs, function(t){
        if (t.id == tab.id) {
          t.active = true;
          var avatars = Annuaire.avatars(tab.entrees);
         avatars.$promise.then(function(reponse){
          _.each(tab.entrees, function(entree){
            entree.owner.avatar = LACLASSE_PATH + '/' + reponse[entree.owner.uid];
          });
        });
        } else{
          t.active = false;
        };
      });
    };

    $scope.changeNameTab = function(tab){
      if (CurrentUser.getRights().profil == "parent" || CurrentUser.getRights().profil == "élève" || CurrentUser.getRights().admin == 0) {
        alert("vous n'êtes pas autorisé à modifier l'onglet !")
        return false;
      }
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
      if (CurrentUser.getRights().profil == "parent" || CurrentUser.getRights().profil == "élève" || CurrentUser.getRights().admin == 0) {
        alert("vous n'êtes pas autorisé à ajouter un onglet !")
        return false;
      }
      var newTab = {
        id: null,
        carnet_id: null,
        ordre: null,
        owner: "",
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
          newTab.carnet_id = reponse.carnet_id;
          newTab.ordre = reponse.ordre;
          newTab.owner = reponse.owner;
          $scope.activeTab(newTab);
          $scope.tabs.push(newTab);            
        } else {
          alert(reponse.error);
        };
      });
    };

    $scope.removeTab = function(tab){
      if (CurrentUser.getRights().profil == "parent" || CurrentUser.getRights().profil == "élève" || CurrentUser.getRights().admin == 0) {
        alert("vous n'êtes pas autorisé à supprimer l'onglet !")
        return false;
      }
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
      if (CurrentUser.getRights().write == 0) {
        alert("vous n'êtes pas autorisé à ajouter une entrée !")
        return false;
      }
      if (tab.htmlcontent.trim()=="") {return false;};
      if (tab.modifEntree == null) {
        var owner = Annuaire.get_infos_of(CurrentUser.get(), $stateParams.classe_id);
        var entree = {
          id: null,
          owner: {
            uid: CurrentUser.get().id_ent,
            infos: owner.infos,
            avatar: CurrentUser.get().avatar,
            back_color: owner.back_color,
            avatar_color: owner.avatar_color
          },
          contenu: tab.htmlcontent,
          date: Date.now()
        };
        Entrees.post({id_onglet: tab.id, carnet_id: tab.carnet_id, uid: entree.owner.uid, avatar: entree.owner.avatar, avatar_color: entree.owner.avatar_color, back_color: entree.owner.back_color, infos: entree.owner.infos, contenu: entree.contenu}).$promise.then(function(reponse){
          if (reponse.error != undefined && reponse.error != null) {
            alert(reponse.error);
          } else{
            _.each($scope.tabs, function(t){
              if (t.id == tab.id) {
                entree.id = reponse.id;
                entree.owner.avatar = LACLASSE_PATH + '/' + entree.owner.avatar
                t.entrees.push(entree);
                t.htmlcontent = "";
              };
            });
          }
        });
      } else {
        Entrees.update({id: tab.modifEntree, contenu: tab.htmlcontent, avatar: CurrentUser.get().avatar}).$promise.then(function(reponse){
          _.each($scope.tabs, function(t){
            if (t.id == tab.id) {
              _.each(t.entrees, function(e){
                if (e.id == t.modifEntree) {
                  e.contenu = t.htmlcontent;
                  e.owner.avatar = LACLASSE_PATH + CurrentUser.get().avatar;
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
      if (entree.owner.uid != CurrentUser.get().id_ent && CurrentUser.getRights().admin == 0) {
        alert("vous ne pouvez pas editer les entrées qui ne vous appartiennent pas !")
        return false;
      }
      _.each($scope.tabs, function(t){
        if (t.id == tab.id) {
          t.htmlcontent = entree.contenu;
          t.modifEntree = entree.id;
        };
      });
    }

    $scope.removedEntree = function(tab, entree){
      if (entree.owner.uid != CurrentUser.get().id_ent && CurrentUser.getRights().admin == 0) {
        alert("vous ne pouvez pas supprimer les entrées qui ne vous appartiennent pas !")
        return false;
      }
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

    $scope.sortableOptions = {
      stop: function(e, ui) {
        for (var index in $scope.tabs) {
          $scope.tabs[index].ordre = index + 1;
          $scope.changeNameTab($scope.tabs[index]);
        }
      }
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
  });

}]);