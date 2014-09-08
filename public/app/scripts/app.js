'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui.router', 'services.authentication', 'services.constants' , 'services.messages', 'services.resources', 'services.user', 'services.svg',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.bootstrap',
  'angular-carousel',
  'textAngular',
  'myApp.controllers'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, currentUser) {

  $stateProvider
          .state( 'suivi',{
            abstract:true,
            templateUrl:'/app/views/generals/index.html'})
          .state( 'suivi.classes',{
            parent: 'suivi',
            url: '/classes',
            views: {
              'aside': {
                templateUrl:'/app/views/generals/lists/asides/aside-lists.html',
                controller: 'AsideCtrl'
              },
              'main': {
                templateUrl:'/app/views/generals/lists/mains/classes/main-classes.html',
                controller: 'ClassesCtrl'
               }
              }
            })
          .state( 'suivi.carnets',{
            parent: 'suivi',
            url: '/carnets/:id_classe',
            views: {
              'aside': {
                templateUrl:'/app/views/generals/lists/asides/aside-lists.html',
                controller: 'AsideCtrl'
              },
              'main': {
                templateUrl:'/app/views/generals/lists/mains/carnets/main-carnets.html',
                controller: 'CarnetsCtrl'
               }
              }
            })
           .state( 'suivi.add',
             { url: '/carnets/add/',
               views: {
                   'aside': {
                 templateUrl:'/app/views/generals/lists/asides/aside-lists.html',
                 controller: 'AsideCtrl'
                   },
                   'main': {
                 templateUrl:'/app/views/generals/lists/mains/carnets/main-add-carnets.html',
                 controller: 'AddCarnetsCtrl'
                   }
               }
             })
           .state( 'suivi.carnet',
             { url: '/carnet/:id',
               views: {
                   'aside': {
                 templateUrl:'/app/views/generals/carnet-eleve/aside-carnet-eleve.html',
                 controller: 'AsideCarnetCtrl'
                   },
                   'main': {
                 templateUrl:'/app/views/generals/carnet-eleve/main-carnet-eleve.html',
                 controller: 'CarnetCtrl'
                   }
               }
             })
           .state( 'suivi.rights',
             { url: '/carnet/rights/:id',
               views: {
                   'aside': {
                 templateUrl:'/app/views/generals/carnet-eleve/aside-carnet-eleve.html',
                 controller: 'AsideCarnetCtrl'
                   },
                   'main': {
                 templateUrl:'/app/views/generals/carnet-eleve/main-rights-carnet-eleve.html',
                 controller: 'RightsCtrl'
                   }
               }
             });

  // $stateProvider.state('list_carnets_evignal', {url:'/list/carnets/evignal', templateUrl: '/partials/list_carnets_evignal.html', controller: 'ListCarnetsEVignalCtrl'});
  // $stateProvider.state('list_carnets', {url:'/list/carnets', templateUrl: '/partials/list_carnets.html', controller: 'ListCarnetsCtrl'});
  // $stateProvider.state('my_carnet', {url:'/carnet', templateUrl: '/partials/my_carnet.html', controller: 'MyCarnetCtrl'});
  $urlRouterProvider.otherwise('/classes');
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

