'use strict';

/* Services */
angular.module('suiviApp')
.service('CurrentUser', ['Annuaire', 'Rights', '$state', function( Annuaire, Rights, $state) {
  var currentUser = null;
  var rights = null;
  this.set = function(user){
    currentUser = user;
  }
  this.get = function(){
    return currentUser;
  }
  this.getRequest = function(){
    return Annuaire.get_current_user();
  }
  this.setRights = function(right){
    rights = right;
  }
  this.getRights = function(){
    return rights;
  }
  this.verifRights = function(carnet, uid_elv, right){
    if (currentUser == null) {$state.go( 'erreur', {code: '404', message: "Utilisateur courant non trouvé"}, { reload: true, inherit: true, notify: true } );}
    else if (currentUser.error != undefined) {$state.go( 'erreur', {code: '404', message: currentUser.error}, { reload: true, inherit: true, notify: true } );};
    if (carnet.error != undefined) {$state.go( 'erreur', {code: '404', message: carnet.error}, { reload: true, inherit: true, notify: true } );};
    var priority = 1
    _.each(currentUser.roles, function(role){
      if (role.etablissement_code_uai == carnet.uai && role.priority > priority){
        priority = role.priority;
      }
    })
    if (priority <= 1) {
       if (rights == null) {$state.go( 'erreur', {code: '404', message: "Aucun droits trouvé pour l'utilisateur courant"}, { reload: true, inherit: true, notify: true } );}
      else if (rights.error != undefined) {$state.go( 'erreur', {code: '404', message: rights.error}, { reload: true, inherit: true, notify: true } );};
      switch(right){
        case 'read':
          if (rights.read != 1) {$state.go( 'erreur', {code: '401', message: null}, { reload: true, inherit: true, notify: true } );};
          break;
        case 'write':
          if (rights.write != 1) {$state.go( 'erreur', {code: '401', message: null}, { reload: true, inherit: true, notify: true } );};
          break;
        case 'admin':
          if (rights.admin != 1) {$state.go( 'erreur', {code: '401', message: null}, { reload: true, inherit: true, notify: true } );};
          break;
      }
    } else{
      rights.read = 1;
      rights.write = 1;
      rights.admin = 1;
    };
    return true;
  }
  this.getRightsRequest = function(uid_elv){
    return Rights.users({uid: currentUser.id_ent, uid_elv: uid_elv, carnet_id: null});
  }
}])
.service('Erreur', [function() {
  this.message = function(code, messagePerso){
    if (messagePerso == null) {
      var message = "Une erreur s'est produite !";
      switch (code) {
        case '404':
          message = "Circulez, il n'y a rien à voir !!";
          break;
        case '401':
          message = "Vous n'êtes pas autorisé !!";
          break;
      }
    } else {
      message = messagePerso;
    };
    return message;
  };
}])

.service('Profil', ['CurrentUser', '$state', 'Carnets', '$q', function( CurrentUser, $state, Carnets,$q ) {
  this.redirection = function(allowed_types){
    CurrentUser.getRequest().$promise.then(function(currentUser){
      console.log(currentUser);
      CurrentUser.set(currentUser);
      var stateName = 'erreur';
      var params = {code: '404', message: null}
      var uid_elv = "";
      var right = false;
      if (allowed_types.length === 0 || allowed_types.indexOf(currentUser.hight_role) === -1) {
        switch ( currentUser.hight_role ) {
          case 'TECH':
            stateName = 'suivi.classes';
            break;
          case 'DIR_ETB':
            stateName = 'suivi.classes';
            break;
          case 'ADM_ETB':
            stateName = 'suivi.classes';
            break;
          case 'AVS_ETB':
            stateName = 'suivi.classes';
            break;
          case 'PROF_ETB':
            stateName = 'suivi.classes';
            break;
          case 'CPE_ETB':
            stateName = 'suivi.classes';
            break;
          case 'ELV_ETB':
            stateName = 'suivi.carnet';
            params = {classe_id: currentUser.classes[0].classe_id, id: currentUser.id_ent};           
            break;                            
          case 'PAR_ETB':
            stateName = 'suivi.carnet';
            params = {classe_id: currentUser.enfants[0].classes[0].classe_id, id: currentUser.enfants[0].enfant.id_ent};
            break;
        }
        $state.go( stateName, params, { reload: true, inherit: true, notify: true } ); 
      };
    });
  };
  this.initRights = function(uid_elv){
    var deferred = $q.defer();
    var currentUser = CurrentUser.get();
    if (currentUser == null) {
      CurrentUser.getRequest().$promise.then(function(cu){
        CurrentUser.set(cu);
        Carnets.get({uid_elv: uid_elv, id: null}).$promise.then(function(carnet){
          CurrentUser.getRightsRequest(uid_elv).$promise.then(function(right){
            CurrentUser.setRights(right);
            deferred.resolve(CurrentUser.verifRights(carnet, uid_elv, "read"));
            // return CurrentUser.getRights();
          });
        });
      });
    } else {
      Carnets.get({uid_elv: uid_elv, id: null}).$promise.then(function(carnet){
        CurrentUser.getRightsRequest(uid_elv).$promise.then(function(right){
          CurrentUser.setRights(right);
          deferred.resolve(CurrentUser.verifRights(carnet, uid_elv, "read"));
          // return CurrentUser.getRights();
        });
      });
    };
    return deferred;
  };
}])

.service('Donnee', [function() {
  this.tri_emails = function(emails){
    var good_email = "Non renseigné";
    var emailRegex = /\A(v[a-z]{2}[0-9]{5})\z/i;
    var emailDom = "laclasse.com";
    angular.forEach(emails, function (email) {
      var splitMail = email.adresse.split('@');
      if (emailRegex.test(splitMail[0])=== false && splitMail[1].toLowerCase() == emailDom) {
        good_email = email.adresse
      };
    });
    return good_email;
  };

  this.tri_telephones = function(telephones){
    var tels = {
      tel_port: "Non renseigné",
      tel_dom: "Non renseigné"
    };
    var telDomRegex = /^(\+33[1-5]{1}|0[1-5]{1}|09)/;
    var telPortRegex = /^(\+33[6-7]{1}|0[6-7]{1})/;
    angular.forEach(telephones, function (tel) {
      if (telDomRegex.test(tel.numero) === true) {
        tels.tel_dom = tel.numero;
      };
      if (telPortRegex.test(tel.numero) === true) {
        tels.tel_port = tel.numero;
      };
    });
    return tels;
  };
}]);



// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('myApp.services', []).
//   value('version', '0.1');

// /* service authentication */
// angular.module('services.authentication', []);
// angular.module('services.authentication').factory('currentUser', function(){
//     var currentUser = {}; 
//     return {
//       get_current_user: function(){
//         return currentUser;
//       },

//       set_current_user: function(current_user){
//         currentUser = current_user;
//       }
//     }
// });

// /* constant for static pages routing */
// angular.module('services.constants', []); 
// angular.module('services.constants').constant('APP_PATH', 'http://localhost:9292/v3/suivi');
// angular.module('services.constants').constant('BASE_SERVICE_URL', 'http://localhost:9292/suivi/api');
// angular.module('services.constants').constant('SERVICE_ANNUAIRE', '/annuaire');
// angular.module('services.constants').constant('SERVICE_CARNETS', '/carnets');
// angular.module('services.constants').constant('EVIGNAL', 'CLG-E VIGNAL');
// /******************************************************************************************/
// /*                       Service Resources                                                */
// /******************************************************************************************/

// angular.module('services.resources', ['ngResource', 'services.constants']);

/******************************************************************************************/
/*                         Resources example                                              */
/******************************************************************************************/
//  angular.module('services.resources').factory('currentUser', ['$resource','BASE_SERVICE_URL', 'SERVICE_ANNUAIRE',  function($resource, BASE_SERVICE_URL, SERVICE_ANNUAIRE) {
//     var baseUrl = BASE_SERVICE_URL + SERVICE_ANNUAIRE + '/user/session'; 
//     return $resource(baseUrl,{});
// }]);


/************************************************************************************/
/*                   Resource to show flash messages and responses                  */
/************************************************************************************/
angular.module('services.messages', []); 
angular.module('services.messages').factory("FlashServiceStyled", ['$rootScope', function($rootScope) {
  return {
    show: function(message, classe) {
      /* classe in ["alert alert-error", "alert alert-success", "alert alert-info", "alert alert-warning"] */
      $rootScope.flashMessage = message;
      $rootScope.flashStyle = classe
    },
    clear: function() {
      $rootScope.flashMessage = "";
      $rootScope.flashStyle ="alert"; 
    }
  }
}]);

// angular.module('services.user', []); 
// angular.module('services.user').factory("User", ['$http', '$location', '$rootScope', function($http, $location, $rootScope) {
//   return {

//     verify : function(current_user, eVignal){     
//       if(current_user.info.ENTStructureNomCourant != eVignal){
//         //TODO a remettre plus tard.
//         // $location.url('/list/carnets');
//       }
//     },

//     init : function(base_url, service){
//       $http.get(base_url+service).success(function(data){
//         $rootScope.current_user = data;
//       })
//     }
//   }
// }]);
// angular.module('services.svg', []); 
// angular.module('services.svg').factory("Svg", function() {
//   return {
//     modifyFill : function(svgId, color){
//       console.log(svgId +" , " + color);
//       var s = document.getElementById(svgId)
//       if (s!=null) {
//         s.addEventListener("load", function() {
//           var doc = this.getSVGDocument();
//           var rect = doc.querySelector("path"); // suppose our image contains a <rect>
//           rect.setAttribute("fill", color);
//         });
//       };
//     }
//   }
// });
