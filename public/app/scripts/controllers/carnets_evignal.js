'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('CarnetsEvignalCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'Carnets', 'CarnetsEvignal', 'Rights', 'CurrentUser', function($scope, $rootScope, $state, $stateParams, Carnets, CarnetsEvignal, Rights, CurrentUser) {
	CarnetsEvignal.query().$promise.then(function(response){
		if (response[0] != undefined && response[0].error != undefined && response[0].error != null){
			alert(response[0].error);
		} else {
			$scope.carnets = Carnets.get_by_name(response);
			console.log($scope.carnets);			
		}
	});

	$scope.open = function(carnet){
		CurrentUser.getRightsRequest(carnet.uid_elv).$promise.then(function(right){
			CurrentUser.setRights(right);
			carnet.uai = carnet.etablissement_code;
			if(CurrentUser.verifRights(carnet, carnet.uid_elv, 'read') == true){
		    	$state.go( 'suivi.evignal_carnet', {classe_id: carnet.classe_id, id: carnet.uid_elv}, { reload: true, inherit: true, notify: true } );
		    };
		});
	}
}]);