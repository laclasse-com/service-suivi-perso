'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('CarnetCtrl', ['$scope', '$stateParams', 'Onglets', 'Entrees', 'Annuaire', 'CurrentUser', 'AVATAR_M', 'AVATAR_F', function($scope, $stateParams, Onglets, Entrees, Annuaire, CurrentUser, AVATAR_M, AVATAR_F) {

  Onglets.get({uid: $stateParams.id}, function(reponse){
    console.log(reponse);
    if (reponse.error == undefined) {
      _.each(reponse.onglets, function(tab){
        _.each(tab.entrees, function(entree){
          entree.date = new Date(entree.date);
        });
      });
      $scope.tabs = reponse.onglets;      
    } else{
      alert(reponse[0].error);
    };
  });
  // $scope.tabs = [
  //   {
  //     id: 0,
  //     name: "Maths",
  //     editable: false,
  //     active: true,
  //     htmlcontent: "",
  //     modifEntree: null,
  //     entrees: [
  //                 {
  //                   id: 0,
  //                   message: "je suis sophie",
  //                   date: Date.now()
  //                 }
  //               ]
  //   },
  //   {
  //     id: 1,
  //     name: "Anglais",
  //     editable: false,
  //     active: false,
  //     htmlcontent: "",
  //     modifEntree: null,
  //     entrees: []
  //   }
  // ];

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
      id_carnet: null,
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
        newTab.id_carnet = reponse.id_carnet
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
      Entrees.post({id_onglet: tab.id, id_carnet: tab.carnet_id, uid: entree.owner.uid, avatar: entree.owner.avatar, infos: entree.owner.infos, contenu: entree.contenu}).$promise.then(function(reponse){
        if (reponse.error != undefined && reponse.error != null) {
          alert(reponse.error);
        } else{
          _.each($scope.tabs, function(t){
            if (t.id == tab.id) {
              entree.id = reponse.id;
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
    // for (var i = 0; i < $scope.tabs.length; i++) {
    //   if ($scope.tabs[i].id == tabId) {
    //     if ($scope.tabs[i].htmlcontent.trim()=="") {return false;};
    //     if ( $scope.tabs[i].modifEntree != null){
    //       for (var j = 0; j < $scope.tabs[i].entrees.length; j++) {
    //         if ($scope.tabs[i].entrees[j].id == $scope.tabs[i].modifEntree) {
    //           $scope.tabs[i].entrees[j].message = $scope.tabs[i].htmlcontent;
    //           $scope.tabs[i].modifEntree = null;
    //         };
    //       };
    //     } else {
           
    //     }
    //     $scope.tabs[i].htmlcontent = "";
    //   };
    // };
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
}]);