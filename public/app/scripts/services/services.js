'use strict';

/* Services */
angular.module('suiviApp')
.service('CurrentUser', ['Annuaire', function( Annuaire ) {
  var currentUser = null;
  this.set = function(user){
    currentUser = user;
  }
  this.get = function(){
    return currentUser;
  }
  this.getRequest = function(){
    return Annuaire.get_current_user();
  }
}])

.service('Profil', ['CurrentUser', '$state', function( CurrentUser, $state ) {
  this.redirection = function(allowed_types){
    CurrentUser.getRequest().$promise.then(function(currentUser){
      CurrentUser.set(currentUser);
      if (allowed_types.length === 0 || allowed_types.indexOf(currentUser.profil_id) === -1) {
        var stateName = '404';
        var params = $state.params
        console.log(currentUser);
        switch ( currentUser.profil_id ) {
          case 'DIR':
            stateName = 'suivi.classes';
            break;
          case 'ETA':
            stateName = 'suivi.classes';
            break;
          case 'EVS':
            stateName = 'suivi.classes';
            break;
          case 'ENS':
            stateName = 'suivi.classes';
            break;
          case 'DOC':
            stateName = 'suivi.classes';
            break;
          case 'ELV':
            stateName = 'suivi.carnet';
            params = {classe_id: currentUser.classes[0].classe_id, id: currentUser.id_ent}
            break;
          case 'TUT':
            stateName = 'suivi.carnet';
            params = {classe_id: currentUser.enfants[0].classes[0].classe_id, id: currentUser.enfants[0].enfant.id_ent}
            break;
         }
        $state.go( stateName, params, { reload: true, inherit: true, notify: true } );
        
      };
    });
  }
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
