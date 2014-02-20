'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('ListCarnetsEVignalCtrl', ['$scope', 'BASE_SERVICE_URL', 'SERVICE_CARNETS', '$http', '$location', function($scope, BASE_SERVICE_URL, SERVICE_CARNETS, $http, $location) {

  	$scope.carnets = [];
 
  	/*Récupère tous les carnets d'un utilisateur*/
	$http.get(BASE_SERVICE_URL+SERVICE_CARNETS+'/VAA60459').success(function(data){
		$scope.carnets = data;
	})

	/*Quand un double click sur un carnet on charge la page d'un carnet*/
	$scope.openCarnet = function(carnet){
		console.log("toto");
		$location.url('/carnet');
	}
  }])
  .controller('ListCarnetsCtrl', [function() {

  }])
  .controller('MyCarnetCtrl', [function() {

  }]);
  
  
function RootCtrl($scope, currentUser, $rootScope, APPLICATION_PREFIX_URL, BASE_SERVICE_URL, SERVICE_ANNUAIRE, FlashServiceStyled, $http){
  
  //$rootScope.current_user = currentUser;
  //initialize application prefix for images and css 
  $rootScope.app_prefix = APPLICATION_PREFIX_URL;
  //console.log("currentuser", currentUser);
  //console.log($rootScope.current_user);
  $rootScope.initCurrentUser = function(){
  	$http.get(BASE_SERVICE_URL+SERVICE_ANNUAIRE+'/user/session').success(function(data){
  		$rootScope.current_user = data;
  		currentUser = $rootScope.current_user
  		console.log(currentUser);
  	})
  }

  
};
RootCtrl.$inject=['$scope', 'currentUser', '$rootScope', 'APPLICATION_PREFIX_URL', 'BASE_SERVICE_URL', 'SERVICE_ANNUAIRE', 'FlashServiceStyled', '$http'];


