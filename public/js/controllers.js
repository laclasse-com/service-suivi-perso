'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('ListCarnetsEVignalCtrl', ['$scope', '$rootScope', 'BASE_SERVICE_URL', 'SERVICE_CARNETS', '$http', '$location', 'User', 'Svg', 'EVIGNAL',
    function($scope, $rootScope, BASE_SERVICE_URL, SERVICE_CARNETS,$http, $location, User, Svg, EVIGNAL) {

    $('#tlp').tooltip();
    //on verifie que l'utilisateur est bien de E.VIGNAL
    User.verify($rootScope.current_user, EVIGNAL);

    $scope.admin = false;
    $scope.carnets = [];

    $scope.search = "";
 
  	/*Récupère tous les carnets d'un utilisateur*/
  	$http.get(BASE_SERVICE_URL+SERVICE_CARNETS+'/evignal/'+$rootScope.current_user.info.uid).success(function(data){
  		$scope.carnets = data;
      // for (var i = data.length - 1; i >= 0; i--) {
      //   Svg.modifyFill("carnet"+i, data[i].avatar);
      // };
    })

    $scope.delSearch = function(){
      $scope.search ="";
    }
  	/*Quand un double click sur un carnet on charge la page d'un carnet*/
  	$scope.openCarnet = function(carnet){
  		$location.url('/carnet');
  	}
  }])
  .controller('ListCarnetsCtrl', ['$scope', '$rootScope', '$http', 'BASE_SERVICE_URL', 'SERVICE_ANNUAIRE', 
    function($scope, $rootScope, $http, BASE_SERVICE_URL, SERVICE_ANNUAIRE) {
    
    $scope.regroupements = [];

    $scope.search = "";



    $http.get(BASE_SERVICE_URL + SERVICE_ANNUAIRE + '/regroupements/' + $rootScope.current_user.info.uid).success(function(data){
      $scope.regroupements = data;
    });

    /*Quand un double click sur un carnet on charge la page d'un carnet*/
    $scope.openCarnet = function(carnet){
      $location.url('/carnet');
    }

    $scope.delSearch = function(){
      $scope.search ="";
    }
  }])
  .controller('MyCarnetCtrl', [function() {

  }]);
  
  
function RootCtrl($scope, currentUser, $rootScope, APPLICATION_PREFIX_URL, BASE_SERVICE_URL, SERVICE_ANNUAIRE, FlashServiceStyled, $http, User, Svg, EVIGNAL){

  //initialize application prefix for images and css 
  $rootScope.app_prefix = APPLICATION_PREFIX_URL;
  //initialisation de l'utilisateur.
  $rootScope.initCurrentUser = function(){
    User.init(BASE_SERVICE_URL, SERVICE_ANNUAIRE+'/user/session');
    currentUser.set_current_user($rootScope.current_user);
  }
  Svg.modifyFill("logolaclasse", "white");
};
RootCtrl.$inject=['$scope', 'currentUser', '$rootScope', 'APPLICATION_PREFIX_URL', 'BASE_SERVICE_URL', 'SERVICE_ANNUAIRE', 'FlashServiceStyled', '$http', 'User', 'Svg', 'EVIGNAL'];


