'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('CarnetsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'Carnets', 'GetByClasse', 'Rights', 'CurrentUser', function($scope, $rootScope, $state, $stateParams, Carnets, GetByClasse, Rights, CurrentUser) {
	GetByClasse.query({id: $stateParams.classe_id}).$promise.then(function(response){
		$scope.classe_carnets = Carnets.get_by_classe(response);
		console.log($scope.classe_carnets);
	});

	$scope.return = function(){
		$state.go( 'suivi.classes', {}, { reload: true, inherit: true, notify: true } );
	}

	$scope.open = function(carnet){
		CurrentUser.getRightsRequest(carnet.uid_elv).$promise.then(function(right){
			CurrentUser.setRights(right);
			carnet.uai = carnet.etablissement_code;
			if(CurrentUser.verifRights(carnet, carnet.uid_elv, 'read') == true){
		    	$state.go( 'suivi.carnet', {classe_id: carnet.classe_id, id: carnet.uid_elv}, { reload: true, inherit: true, notify: true } );
		    };
		});
	}
}]);