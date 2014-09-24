'use strict';

// Declare app level module which depends on filters, and services
angular.module('suiviApp', [
  'ui.router', 
  'ngResource', 
  'services.messages',
  'ui.bootstrap',
  'angular-carousel',
  'textAngular'
]).run(['$rootScope', 'FlashServiceStyled', '$location', 'CurrentUser', function($rootScope, FlashServiceStyled, $location, CurrentUser) {
  $rootScope.$on('$stateChangeStart', function($location){
    // console.log("good");
    FlashServiceStyled.clear(); 
  });
  window.scope = $rootScope;
  FlashServiceStyled.clear(); 
}]);

