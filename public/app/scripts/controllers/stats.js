'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('StatsCtrl', ['$rootScope', '$scope', 'Notifications', 'Stats', function($rootScope, $scope, Notifications, Stats) {

	Stats.get({}).$promise.then(function(reponse){
		if (reponse.error != undefined) { 
			Notifications.add(reponse.error, "error")
		} else {
			$scope.stats = reponse;
			$scope.xAxisTickFormatFunction = function(){
				return function(d){
					// return d3.time.format('%b')(new Date(d));
					return $scope.stats.carnets_classe;
				}
			}
		};
	});
}]);