'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('CarnetCtrl', ['$rootScope', '$scope', '$stateParams', '$modal', 'Onglets', 'Entrees', 'Carnets', 'Annuaire', 'CurrentUser', 'AVATAR_DEFAULT', 'AVATAR_M', 'AVATAR_F', 'LACLASSE_PATH', 'APP_PATH', 'Rights', '$state', 'Profil', '$window', '$upload', '$http', function($rootScope, $scope, $stateParams, $modal, Onglets, Entrees, Carnets, Annuaire, CurrentUser, AVATAR_DEFAULT, AVATAR_M, AVATAR_F, LACLASSE_PATH, APP_PATH, Rights, $state, Profil, $window, $upload, $http) {

  
  Profil.initRights($stateParams.id).promise.then(function(){
    $rootScope.docs=[];

    $scope.deleteDoc = function(doc, id_carnet){
      $rootScope.docs = _.reject($rootScope.docs, function(d){
        if (doc.id!= null) {
          Entrees.deleteDoc({id: doc.id, id_carnet: id_carnet}).$promise.then(function(reponse){
            if (reponse.error != undefined) {
              alert(reponse.error);
              return false;
            };
          });
        };
        return doc.md5 == d.md5;
      });
    }

    $scope.getDoc = function(doc, id_carnet){
      if (doc.id!= null) {
        $http.get(APP_PATH + '/api/entrees/docs/'+doc.id+'?id_carnet='+id_carnet, {'responseType' :'blob'}).success(function(data, status) {
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(data);
            link.download=doc.nom;
            link.click();
        });
      };
    }

    Onglets.get({uid: $stateParams.id}, function(reponse){
      console.log(reponse);
      if (reponse.error == undefined) {
        var entrees = []
        if (reponse.onglets[0]!=undefined) {entrees = reponse.onglets[0].entrees; $window.sessionStorage.setItem("id", reponse.onglets[0].carnet_id);};
        var avatars = Annuaire.avatars(entrees);
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
          $window.sessionStorage.setItem("id", reponse.carnet_id);            
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
      if (tab.htmlcontent.trim()=="") {alert("Vous devez obligatoirement avoir du texte dans votre message !");return false;};
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
          docs: [],
          date: Date.now()
        };
        Entrees.post({id_onglet: tab.id, carnet_id: tab.carnet_id, uid: entree.owner.uid, avatar: entree.owner.avatar, avatar_color: entree.owner.avatar_color, back_color: entree.owner.back_color, infos: entree.owner.infos, contenu: entree.contenu, docs: entree.docs}).$promise.then(function(reponse){
          if (reponse.error != undefined && reponse.error != null) {
            alert(reponse.error);
          } else{
            _.each($scope.tabs, function(t){
              if (t.id == tab.id) {
                entree.id = reponse.id;
                entree.owner.avatar = LACLASSE_PATH + '/' + entree.owner.avatar;
                if ($rootScope.docs.length > 0) {
                  $upload.upload({
                    url: APP_PATH + '/api/entrees/upload', //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    // headers: {'Cookie': {suivi_api: JSON.stringify($cookies['suivi_api'])}},
                    withCredentials: true,
                    data: {id_carnet: tab.carnet_id, id_entree: entree.id },
                    file: $rootScope.docs[0].file, // or list of files ($files) for html5 only
                    //fileName: 'doc.jpg' or ['$window.sessionStorage.getItem("prenom").jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Disposition'), server side file variable name. 
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                  }).success(function(data, status, headers, config) {
                    entree.docs = data.docs;              
                    t.entrees.push(entree);
                    t.htmlcontent = "";
                    $rootScope.docs = [];
                  });
                } else {
                  t.entrees.push(entree);
                  t.htmlcontent = "";
                };    
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
                  e.owner.avatar = LACLASSE_PATH + '/' + CurrentUser.get().avatar;
                  if ($rootScope.docs.length > 0) {
                    $upload.upload({
                      url: APP_PATH + '/api/entrees/upload', //upload.php script, node.js route, or servlet url
                      method: 'POST',
                      // headers: {'Cookie': {suivi_api: JSON.stringify($cookies['suivi_api'])}},
                      withCredentials: true,
                      data: {id_carnet: tab.carnet_id, id_entree: e.id },
                      file: $rootScope.docs[0].file, // or list of files ($files) for html5 only
                      //fileName: 'doc.jpg' or ['$window.sessionStorage.getItem("prenom").jpg', '2.jpg', ...] // to modify the name of the file(s)
                      // customize file formData name ('Content-Disposition'), server side file variable name. 
                      //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                      // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                      //formDataAppender: function(formData, key, val){}
                    }).success(function(data, status, headers, config) {
                      e.docs = data.docs;
                      t.modifEntree = null;
                      t.htmlcontent = "";
                      $rootScope.docs = [];
                    });                     
                  }else {
                    e.docs = [];
                    t.modifEntree = null;
                    t.htmlcontent = "";
                  };
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
          $rootScope.docs = entree.docs;
        };
      });
    }

    $scope.removedEntree = function(tab, entree){
      if (entree.owner.uid != CurrentUser.get().id_ent && CurrentUser.getRights().admin == 0) {
        alert("vous ne pouvez pas supprimer les entrées qui ne vous appartiennent pas !")
        return false;
      }
      _.each(entree.docs, function(doc){
        Entrees.deleteDoc({id: doc.id, id_carnet: tab.carnet_id});
      });

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