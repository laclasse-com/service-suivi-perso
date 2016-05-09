'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('StatsCtrl', ['$rootScope', '$scope', 'Notifications', 'Stats', '$http', 'APP_PATH', function($rootScope, $scope, Notifications, Stats, $http, APP_PATH) {

	Stats.get({}).$promise.then(function(reponse){
		if (reponse.error != undefined) { 
			Notifications.add(reponse.error, "error")
		} else {
			$scope.etabs = [];
			$scope.classes = [];
			$scope.carnetsClasse = [];
			$scope.carnetsClassePie = [];
			$scope.messagesInterlocsCarnet = [];
			_.each(reponse.stats, function(stat){
				$scope.etabs.push({id: stat.etab_id, nom: stat.etab_nom});
				var key = stat.etab_nom+"  ";
				var values = [];
				var valuesScatter = [];
				_.each(stat.classes, function(classe){
					$scope.classes.push({id: classe.id, nom: classe.nom});
					if (classe.nb_carnets != 0) {
						values.push([classe.nom, classe.nb_carnets]);
						$scope.carnetsClassePie.push({key: classe.nom, y: classe.nb_carnets});						
					};
					_.each(classe.carnets, function(carnet){
						if (carnet.nb_messages != 0) {
							valuesScatter.push({x: carnet.id, y: carnet.nb_interloc, size: carnet.nb_messages});
						};
					});
				});
				if (values.length > 0) {
					$scope.carnetsClasse.push({key: key, values: values});
				};
				if (valuesScatter.length > 0) {
					$scope.messagesInterlocsCarnet.push({key: key, values: valuesScatter});					
				};
			});

            $scope.changeFilter = function(){
            	console.log($scope.etablissement);
				console.log($scope.classe);
				$scope.carnetsClasse = [];
				$scope.carnetsClassePie = [];
				$scope.messagesInterlocsCarnet = [];
				_.each(reponse.stats, function(stat){
					if ($scope.etablissement == undefined || $scope.etablissement.id == stat.etab_id) {
						var key = stat.etab_nom+"  ";
						var values = [];
						var valuesScatter = [];
						_.each(stat.classes, function(c){
							if (($scope.classe == undefined || $scope.classe.id == c.id) && c.nb_carnets != 0) {
								values.push([c.nom, c.nb_carnets]);
								$scope.carnetsClassePie.push({key: c.nom, y: c.nb_carnets});
								_.each(c.carnets, function(carnet){
									if (carnet.nb_messages != 0) {
										valuesScatter.push({x: carnet.id, y: carnet.nb_interloc, size: carnet.nb_messages});
									};
								});
							}
						});
						if (values.length > 0) {
							$scope.carnetsClasse.push({key: key, values: values});
						};
						if (valuesScatter.length > 0) {
							$scope.messagesInterlocsCarnet.push({key: key, values: valuesScatter});					
						};
					};
				});
            }

			$scope.xFunction = function(){
			    return function(d) {
			        return d.key;
			    };
			}
			$scope.yFunction = function(){
				return function(d){
					return d.y;
				};
			}
			$scope.toolTipContentPieFunction = function(){
				return function(key, y) {
			    	return '<p> il y a ' + Math.floor(y) + ' carnet(s) </p>' + 
			    		   '<p> dans la classe ' + key + '</p>'
				}
			}
			$scope.toolTipContentMultiFunction = function(){
				return function(key, x, y) {
			    	return '<p> il y a ' + Math.floor(y) + ' carnet(s) </p>' + 
			    		   '<p> dans la classe ' + x + '</p>' +
			    		   '<p> pour ' + key + '</p>'			    	
				}
			}
			// var colorArray = ['#e8c254', '#eb5454', '#1aa1cc', '#9c75ab', '#80ba66'];
			// $scope.colorFunction = function() {
			// 	return function(d, i) {
			//     	return colorArray[i%5];
			// 	};
			// }
			// $scope.xAxisTickFormatFunction = function(){
			// 	return function(d){
			// 		console.log(d);
			// 		return d.x;
			// 	}
			// }

		};
	});
	$scope.downloadStats = function(){
		$http.get(APP_PATH + '/api/stats/csv', {'responseType' :'blob'}).success(function(data, status) {
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(data);
            link.download='Statistiques_suivi_perso.csv';
    		document.body.appendChild(link);
            link.click();
        });
	}
}]);