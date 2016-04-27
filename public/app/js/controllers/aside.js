'use strict';

/* Controllers */

angular.module('suiviApp')
    .controller('AsideCtrl', ['$scope', '$state', '$stateParams', 'CurrentUser', function($scope, $state, $stateParams, CurrentUser) {

	$scope.nameElv = $stateParams.name;
	$scope.erreur = "";
	$scope.accueil = "classes";

	$scope.return = function(){
	    $state.go( 'suivi.classes', {}, { reload: true, inherit: true, notify: true } );
	};

	$scope.stats = function(){
	    $state.go( 'suivi.stats', {}, { reload: true, inherit: true, notify: true } );
	};

	$scope.search = function(name){
	    if(name != null && name != "" && name.length > 2){
		$state.go( 'suivi.add', {name: name}, { reload: true, inherit: true, notify: true } );
	    } else {
		$scope.erreur = "Au minimum trois caractères sont nécessaires pour effectuer une recherche !";
	    }
	};

	if ($state.current.name == 'suivi.classes') {
	    $scope.backClassesDisplay = false;
	}else{
	    $scope.backClassesDisplay = true;
	};

	if ($state.current.name == 'suivi.stats') {
	    $scope.statsDisplay = false;
	}else{
	    if (CurrentUser.get() != null) {
		$scope.statsDisplay = ["DIR_ETB", "ADM_ETB", "TECH"].indexOf(CurrentUser.get().hight_role) != -1 ;
	    } else {
		$scope.statsDisplay = true;
	    };
	};

	$scope.delSearch = function(){
	    $scope.nameElv ="";
	    $scope.erreur = "";
	    $state.go( 'suivi.classes', {}, { reload: true, inherit: true, notify: true } );
	};

    }]);
