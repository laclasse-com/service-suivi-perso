'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('AsideCarnetEvignalCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'CurrentUser', 'Annuaire', 'AVATAR_F', 'AVATAR_M', 'GetUser', 'GetRegroupement', 'APP_PATH', 'Rights', 'Profil', 'CarnetPdf', '$http', 'Onglets', '$modal', '$window', '$upload', 'UPLOAD_SIZE', 'UAI_EVIGNAL', 'GetPersonnelsEvignal', 'CarnetPersonnelsEvignal', 'Notifications', function($rootScope, $scope, $state, $stateParams, CurrentUser, Annuaire, AVATAR_F, AVATAR_M, GetUser, GetRegroupement, APP_PATH, Rights, Profil, CarnetPdf, $http, Onglets, $modal, $window, $upload, UPLOAD_SIZE, UAI_EVIGNAL, GetPersonnelsEvignal, CarnetPersonnelsEvignal, Notifications) {

  Profil.initRights($stateParams.id).promise.then(function(){
  
    $scope.contactCollege = [];
    $scope.parents = [];
    $scope.disableCollegeEvignal = false;
    $scope.contactCollegeTitle = "Contacts Collège de l'élève"
    GetUser.get({id: $stateParams.id}).$promise.then(function(reponse){
      $scope.user = Annuaire.get_user(reponse);
      if ($scope.user.classe.etablissement_code == UAI_EVIGNAL) {
        $scope.disableCollegeEvignal=true; 
        $scope.contactCollegeTitle = "Contacts Collège"
        $window.sessionStorage.setItem("evignal", true);
        $window.sessionStorage.setItem("uai_etab_elv", $scope.user.classe.etablissement_code);
      } else {
        $window.sessionStorage.setItem("evignal", false);
        $window.sessionStorage.setItem("uai_etab_elv", $scope.user.classe.etablissement_code);
      };
      $window.sessionStorage.setItem("nom", $scope.user.nom);
      $window.sessionStorage.setItem("prenom", $scope.user.prenom);
      if (CurrentUser.getRights().admin == 1) {
        $scope.show = true;
      };
      angular.forEach(reponse.parents, function(parent){
        GetUser.get({id: parent.id_ent}).$promise.then(function(rep){
          $scope.parents.push( Annuaire.get_parent(rep));
        });
      });
    });

    GetRegroupement.get({id: $stateParams.classe_id}).$promise.then(function(reponse){
      $scope.contactCollege = Annuaire.get_contact_college(reponse.profs);
    });

    CarnetPersonnelsEvignal.get({uid_elv: $stateParams.id, hopital: true}).$promise.then(function(reponse){
      if (reponse.error != undefined) {
       alert(reponse.error);
      }else{
        $scope.contactHopital = Annuaire.get_contact_hopital(reponse.personnels);
      };
    });

    CarnetPersonnelsEvignal.get({uid_elv: $stateParams.id, hopital: false}).$promise.then(function(reponse){
      if (reponse.error != undefined) {
       alert(reponse.error);
      }else{
        $scope.contactEvignal = Annuaire.get_contact_hopital(reponse.personnels);
      };
    });

    $scope.contactEvignal = [];
    $scope.contactHopital = [];
    $scope.contactCollege = [];
    $scope.avatar_m = APP_PATH + AVATAR_M;
    $scope.avatar_f = APP_PATH + AVATAR_F;

    $scope.allNeedsClicked = function (type) {
      var list = [];
      switch(type){
        case "eleve":
          list = $scope.contactCollege;
          break;
        case "evignal":
          list = $scope.contactEvignal;
          break;
        case "hopital":
          list = $scope.contactHopital;
          break;
        default:
          list = [];
          break;
      }

      var newValue = !$scope.allNeedsMet(type);
      
      _.each(list, function (contact) {
        contact.done = newValue;
      });
    };
    
    // Returns true if and only if all contacts are done.
    $scope.allNeedsMet = function (type) {
      var list = [];
      switch(type){
        case "eleve":
          list = $scope.contactCollege;
          break;
        case "evignal":
          list = $scope.contactEvignal; // TODO: a remplacer
          break;
        case "hopital":
          list = $scope.contactHopital;
          break;
        default:
          list = [];
          break;
      }
      var needsMet = _.reduce(list, function (memo, contact) {
        return memo + (contact.done ? 1 : 0);
      }, 0);

      return (needsMet === list.length);
    };

    $scope.oneNeedsMet = function(datas){
      var needsMet = _.filter(datas, function(data){ return data.done == true; });
      return (needsMet.length > 0);
    }

    $scope.return = function(){
      $state.go( 'suivi.evignal_carnets', {}, { reload: true, inherit: true, notify: true } );
    }

    $scope.show = false;

    
    $scope.rights = function(){
      $state.go( 'suivi.evignal_rights', $state.params, { reload: true, inherit: true, notify: true } );  
    }

    $rootScope.pdf = function(tabs){
      $http.post(APP_PATH + '/api/carnets/'+$stateParams.id+'/pdf', {'nom': $scope.user.nom, 'prenom': $scope.user.prenom, 'sexe': $scope.user.sexe, 'college': $scope.user.classe.nom_etablissement, 'avatar': $scope.user.avatar, 'classe': $scope.user.classe.libelle, 'id_onglets': tabs}, {'responseType' :'blob'}).success(function(data, status) {
            var blob= new Blob([data], {type:'application/pdf'});
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(blob);
            link.download="Carnet_Suivi_"+$scope.user.prenom+"_"+$scope.user.nom+".pdf";
            link.click();
        });



      // Methode asynchrone avec bug pour plus tard
      // CarnetPdf.post({'uid_elv': $stateParams.id, 'nom': $scope.user.nom, 'prenom': $scope.user.prenom, 'sexe': $scope.user.sexe, 'college': $scope.user.classe.nom_etablissement, 'classe': $scope.user.classe.libelle, 'id_onglets': [1,2,3]}).$promise.then(function(reponse){
      //   var blob= new Blob([reponse], {type:'application/pdf'});
      //   var link=document.createElement('a');
      //   link.href=window.URL.createObjectURL(blob);
      //   link.download="Carnet_Suivi_"+$scope.user.prenom+"_"+$scope.user.nom+".pdf";
      //   link.click();
      // });
    }
  });

  $scope.modalInstanceCtrl = function ($rootScope, $scope, $modalInstance) {
    $rootScope.tabs = [];

    Onglets.tabs({uid: $stateParams.id}, function(reponse){
      if (reponse.error == undefined) {
        $rootScope.tabs = reponse.onglets;  
      } else{
        alert(reponse[0].error);
      };
    });
    $scope.ok = function () {
      if ($scope.oneNeedsMet()) {
        $modalInstance.close();        
      };
      return false;
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.allChecked = function(){
      var needsMet = _.reduce($rootScope.tabs, function (memo, tab) {
        return memo + (tab.check ? 1 : 0);
      }, 0);

      return (needsMet === $rootScope.tabs.length);
    };

    $scope.checkAllOrNot = function(){
      if ($scope.allChecked()) {
        _.each($rootScope.tabs, function (tab) {
          tab.check = false;
        });
      } else {
        _.each($rootScope.tabs, function (tab) {
          tab.check = true;
        });
      };
      return false;
    };

    $scope.oneNeedsMet = function(){
      var needsMet = _.filter($rootScope.tabs, function(tab){ return tab.check == true; });
      return (needsMet.length > 0);
    }
  };

  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: 'myModalPdfContent.html',
      controller: $scope.modalInstanceCtrl,
      size: 'sm'
    });

    modalInstance.result.then(function () {
      var generateTabs = _.filter($rootScope.tabs, function(tab){ return tab.check == true; });
      $rootScope.pdf(generateTabs);        
    });
  };

  $scope.modalInstanceMailCtrl = function ($rootScope, $scope, $modalInstance) {
    $scope.ok = function () {
      if ($rootScope.mail.message != "" && $rootScope.mail.message) {
        $modalInstance.close();                
      };
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.onFileSelect = function($files){
      if ($files[0].size <= UPLOAD_SIZE) {
        $rootScope.mail.file = $files[0];
        $scope.joindreFile.normal=$files[0].name;
        $scope.joindreFile.court=$files[0].name;
        if ($files[0].name.length > 25) {
          $scope.joindreFile.court = $files[0].name.substring(0, 20)+"...";
        };
      } else {
        $files.splice(0,1);
        $scope.joindreFile = {court: "Joindre un fichier", mormal: "Joindre un fichier"};
        alert("La taille du fichier ne doit pas dépasser 25Mo");
      };
    };

    $scope.openUpload = function(){
      $("#inputFile").click();
    };

    $scope.joindreFile = {court: "Joindre un fichier", mormal: "Joindre un fichier"};
    $rootScope.resultats = {success: [], echoue: []};
  };

  $scope.sendMail = function (contacts) {
    $rootScope.mail = _.reduce(contacts, function(memo, contact){
      if (contact.done == true) {memo.destinataires.concatener += contact.fullname + "; "; memo.destinataires.list.push({uid: contact.id_ent, fullname: contact.fullname});};
      return memo;
    }, {destinataires: {list: [], concatener: ""}, objet: "", message: "", uid_exp: CurrentUser.get().id_ent, file: null});

    var modalInstance = $modal.open({
      templateUrl: 'myModalMailContent.html',
      controller: $scope.modalInstanceMailCtrl,
      size: 'sm'
    });

    modalInstance.result.then(function () {  
      var file = $rootScope.mail.file
      $rootScope.mail.file = null
      $upload.upload({
        url: APP_PATH + '/api/carnets/email', //upload.php script, node.js route, or servlet url
        method: 'POST',
        //headers: {'header-key': 'header-value'},
        //withCredentials: true,
        data: {mail_infos: $rootScope.mail},
        file: file, // or list of files ($files) for html5 only
        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        // customize file formData name ('Content-Disposition'), server side file variable name. 
        //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
        //formDataAppender: function(formData, key, val){}
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        if (data['envoye'] != undefined && !_.isEmpty(data['envoye'])) {
          var nomSuccess = "";
          _.each(data["envoye"], function(e){
            nomSuccess += e.name+", ";
          });
          Notifications.add("Message envoyé à "+nomSuccess, "success");
        };
        if (data['echoue'] != undefined && !_.isEmpty(data['echoue'])) {
          var nomEchoue = "";
          _.each(data["echoue"], function(e){
            nomSuccess += e.name+", ";
          });
          Notifications.add("L'envoi du message à "+nomEchoue+" a echoué", "error");
        };
      });
    });
  };

}]);