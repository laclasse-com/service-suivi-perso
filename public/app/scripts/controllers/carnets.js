'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('CarnetsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'Carnets', 'GetByClasse', function($scope, $rootScope, $state, $stateParams, Carnets, GetByClasse) {
	GetByClasse.query({id: $stateParams.classe_id}).$promise.then(function(response){
		$scope.classe_carnets = Carnets.get_by_classe(response);
	});

	$scope.return = function(){
		$state.go( 'suivi.classes', {}, { reload: true, inherit: true, notify: true } );
	}

	$scope.open = function(carnet){
		$state.go( 'suivi.carnet', {classe_id: carnet.classe_id, id: carnet.uid_elv}, { reload: true, inherit: true, notify: true } );
	}
}]);