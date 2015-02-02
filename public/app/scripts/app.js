'use strict';

// Declare app level module which depends on filters, and services
angular.module('suiviApp', [
  'ui.router', 
  'ngResource', 
  'ngCookies',
  'services.messages',
  'ui.bootstrap',
  'ui.sortable',
  'angular-carousel',
  'angular-loading-bar',
  'angularFileUpload',
  'ngClipboard',
  'textAngular',
  'growlNotifications',
  'ngColorPicker'
]).run(['$rootScope', 'Notifications', '$location', 'CurrentUser', function($rootScope, Notifications, $location, CurrentUser) {
  $rootScope.$on('$stateChangeStart', function($location){
    // console.log("good");
    Notifications.clear(); 
  });
  window.scope = $rootScope;
  Notifications.clear(); 
}]);

