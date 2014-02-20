'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

/* service authentication */
angular.module('services.authentication', []);
angular.module('services.authentication').factory('currentUser', function(){
    var currentUser = {} ; 
    return currentUser;
});

/* constant for static pages routing */
angular.module('services.constants', []); 
angular.module('services.constants').constant('APPLICATION_PREFIX_URL', '/app');
angular.module('services.constants').constant('BASE_SERVICE_URL', 'http://localhost:9292/suivi/api');
angular.module('services.constants').constant('SERVICE_ANNUAIRE', '/annuaire');
angular.module('services.constants').constant('SERVICE_CARNETS', '/carnets');
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