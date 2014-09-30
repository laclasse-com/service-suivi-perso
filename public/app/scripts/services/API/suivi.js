angular.module('suiviApp')
.factory('SearchByName', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/eleves/:name', {name: '@name'});
}])
.factory('GetByClasse', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/classes/:id', {id: '@id'});
}])
.factory('Create', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/', {uid_elv: '@uid_elv', full_name_elv: '@full_name_elv', etablissement_code: '@etablissement_code', classe_id: '@classe_id', uid_adm: '@uid_adm', full_name_adm: '@full_name_adm', profil_adm: '@profil_adm'}, {'post': {method: 'POST'}});
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
}])
.factory('Rights', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/rights/', {id: '@id'}, {
		'get':    {method:'GET'},
		'post':   {method:'POST', 
				params: {uid: '@uid', uid_elv: '@uid_elv', full_name: '@full_name', profil: '@profil', read: '@read', write: '@write'}},
		'cud':   {method:'POST', url: APP_PATH + '/api/rights/cud/', params: {uid_elv: '@uid_elv', users: '@users'}},
		'query':  {method:'GET', isArray:true},
		'carnets':  {method:'GET', isArray:false, url: APP_PATH + '/api/rights/carnets/:uid_elv', params: {uid_elv: '@uid_elv'}},
		'update': {method:'PUT', url: APP_PATH + '/api/rights/:id', params: {id: '@id', read: '@read', write: '@write'}},
		'delete': {method:'DELETE', url: APP_PATH + '/api/rights/:id', params: {id: '@id'}}
	});
}]);


angular.module('suiviApp')
.service('Carnets',['GRID_COLOR', 'Create', 'CurrentUser', function(GRID_COLOR, Create, CurrentUser){
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
		var currentUser = CurrentUser.get();
		console.log(currentUser);
		var full_name_adm = currentUser.prenom + " " + currentUser.nom.toLowerCase(); 
		var profil = "admin";
		switch(currentUser.profil_id){
			case 'DIR':
				profil = 'directeur';
				break;
			case 'ENS':
				profil = 'prof';
				break;
		};
		// return Create.post({uid_elv: carnet.uid_elv, full_name_elv: carnet.firstName + " " + carnet.lastName.toLowerCase(), etablissement_code: carnet.etablissement_code, classe_id: carnet.classe_id, uid_adm: currentUser.id_ent, full_name_adm: full_name_adm, profil_adm: profil});
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
