angular.module('suiviApp')
.factory('SearchByName', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/eleves/:name', {name: '@name'});
}])
.factory('GetByClasse', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/classes/:id', {id: '@id'});
}])
.factory('Create', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/', {uid_elv: '@uid_elv', etablissement_code: '@etablissement_code', classe_id: '@classe_id'}, {'post': {method: 'POST'}});
}])
.factory('Onglets', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/onglets/', {uid: '@uid'}, {
		'get':    {method:'GET'},
		'post':   {method:'POST', params: {uid: '@uid', nom: '@nom'}},
		'query':  {method:'GET', isArray:true},
		'update': {method:'PUT', url: APP_PATH + '/api/onglets/:id', params: {id: '@id', nom: '@nom', ordre: '@ordre'}},
		'delete': {method:'DELETE', url: APP_PATH + '/api/onglets/:id', params: {id: '@id'}}
	});
}])
.factory('Entrees', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/entrees/', {id_onglet: '@id_onglet'}, {
		'get':    {method:'GET'},
		'post':   {method:'POST', 
				params: {id_onglet: '@id_onglet', carnet_id: '@carnet_id', uid: '@uid', avatar: '@avatar', avatar_color: '@avatar_color', back_color: '@back_color', infos: '@infos', contenu: '@contenu'}},
		'query':  {method:'GET', isArray:true},
		'update': {method:'PUT', url: APP_PATH + '/api/entrees/:id', params: {id: '@id', contenu: '@contenu'}},
		'delete': {method:'DELETE', url: APP_PATH + '/api/entrees/:id', params: {id: '@id'}}
	});
}]);


angular.module('suiviApp')
.service('Carnets',['GRID_COLOR', 'Create', '$rootScope', function(GRID_COLOR, Create, $rootScope ){
	this.get_by_name = function(reponse){
		var carnets = [];
		var i = 0;
		angular.forEach(reponse, function (carnet) {
			carnet.couleur = GRID_COLOR[i%GRID_COLOR.length];
			carnets.push(carnet);
			i++;
		});
		while (i < 16 || i % 4 != 0){
			carnets.push({id: null, couleur: GRID_COLOR[i%GRID_COLOR.length], uid_elv: null, firstName: '', lastName: '', classe: '', classe_id: null, etablissement_code: null, avatar: '', active: false});
			i++;
		}
		return carnets;
	};

	this.get_by_classe = function(reponse){
		var classe_carnets = {
			classe: {},
			carnets: []
		};
		var i = 0;
		angular.forEach(reponse, function (carnet) {
			carnet.couleur = GRID_COLOR[i%GRID_COLOR.length];
			if (i == 0) {
				classe_carnets.classe = carnet;
			} else {
				classe_carnets.carnets.push(carnet);
			};
			i++;
		});
		while (i < 16 || i % 4 != 0){
			classe_carnets.carnets.push({id: null, couleur: GRID_COLOR[i%GRID_COLOR.length], uid_elv: null, firstName: '', lastName: '', classe: '', classe_id: null, etablissement_code: null, avatar: '', active: false});
			i++;
		}
        return classe_carnets;
	};

	this.create = function(carnet){
		return Create.post({uid_elv: carnet.uid_elv, etablissement_code: carnet.etablissement_code, classe_id: carnet.classe_id});
	};
}]);
/**
 * @ngdoc service
 * @name publicApp.Suivi
 * @description
 * # Suivi
 * Service in the publicApp.
 */
// angular.module('suiviApp')
//   .service('Suivi', function Suivi() {
//     // AngularJS will instantiate a singleton by calling "new" on this function
//   });
