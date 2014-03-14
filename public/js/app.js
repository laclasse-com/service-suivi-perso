'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['services.authentication', 'services.constants' , 'services.messages', 'services.resources', 'services.user', 'services.svg',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'directives.bootstrap.tabset',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider, currentUser) {

  $routeProvider.when('/list/carnets/evignal', {templateUrl: '/app/partials/list_carnets_evignal.html', controller: 'ListCarnetsEVignalCtrl'});
  $routeProvider.when('/list/carnets', {templateUrl: '/app/partials/list_carnets.html', controller: 'ListCarnetsCtrl'});
  $routeProvider.when('/carnet', {templateUrl: '/app/partials/my_carnet.html', controller: 'MyCarnetCtrl'});
  $routeProvider.otherwise({redirectTo: '/list/carnets/evignal'});
}]).run(['$rootScope', 'currentUser', 'FlashServiceStyled', '$location', function($rootScope, currentUser, FlashServiceStyled, $location) {
  //TODO: A REVOIR PLUS TARD
  // currentUser.get().then(function(response){
  //   var current_user = response.data;
  //   console.log(current_user);
  // });
  // if(currentUser.ENTPersonStructRattachRNE == "0690078K"){
  //   $location.url('/list/carnets/evignal');
  // } 
  // $rootScope.current_user = currentUser;
  // $rootScope.$location = $location;
  $rootScope.$on('$stateChangeStart', function($location, currentUser){
    //TODO: A REVOIR PLUS TARD
    // console.log("good");
    // if(currentUser.ENTPersonStructRattachRNE == "0690078K"){
    //   $location.url('/list/carnets/evignal');
    // } 
    FlashServiceStyled.clear(); 
  });
  window.scope = $rootScope;
  FlashServiceStyled.clear(); 
}]);

