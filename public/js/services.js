'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

/* service authentication */
angular.module('services.authentication', []);
angular.module('services.authentication').factory('currentUser', function(){
    var currentUser = {}; 
    return {
      get_current_user: function(){
        return currentUser;
      },

      set_current_user: function(current_user){
        currentUser = current_user;
      }
    }
});

/* constant for static pages routing */
angular.module('services.constants', []); 
angular.module('services.constants').constant('APPLICATION_PREFIX_URL', '/app');
angular.module('services.constants').constant('BASE_SERVICE_URL', 'http://localhost:9292/suivi/api');
angular.module('services.constants').constant('SERVICE_ANNUAIRE', '/annuaire');
angular.module('services.constants').constant('SERVICE_CARNETS', '/carnets');
angular.module('services.constants').constant('EVIGNAL', 'CLG-E VIGNAL');
/******************************************************************************************/
/*                       Service Resources                                                */
/******************************************************************************************/

angular.module('services.resources', ['ngResource', 'services.constants']);

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

angular.module('services.user', []); 
angular.module('services.user').factory("User", ['$http', '$location', '$rootScope', function($http, $location, $rootScope) {
  return {

    verify : function(current_user, eVignal){     
      if(current_user.info.ENTStructureNomCourant != eVignal){
        //TODO a remettre plus tard.
        // $location.url('/list/carnets');
      }
    },

    init : function(base_url, service){
      $http.get(base_url+service).success(function(data){
        $rootScope.current_user = data;
      })
    }
  }
}]);
angular.module('services.svg', []); 
angular.module('services.svg').factory("Svg", function() {
  return {
    modifyFill : function(svgId, color){
      console.log(svgId +" , " + color);
      var s = document.getElementById(svgId)
      if (s!=null) {
        s.addEventListener("load", function() {
          var doc = this.getSVGDocument();
          var rect = doc.querySelector("path"); // suppose our image contains a <rect>
          rect.setAttribute("fill", color);
        });
      };
    }
  }
});
