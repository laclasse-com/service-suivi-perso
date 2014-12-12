angular.module('suiviApp')
.factory('SearchByName', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/eleves/:name', {name: '@name'});
}])
.factory('EvignalSearchByName', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/evignal/eleves/:name', {name: '@name'});
}])
.factory('GetByClasse', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/classes/:id', {id: '@id'});
}])
.factory('Create', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/', {uid_elv: '@uid_elv', full_name_elv: '@full_name_elv', etablissement_code: '@etablissement_code', classe_id: '@classe_id', uid_adm: '@uid_adm', full_name_adm: '@full_name_adm', profil_adm: '@profil_adm', with_model: '@with_model'}, {'post': {method: 'POST'}});
}])
.factory('CreateEvignal', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/evignal', {uid_elv: '@uid_elv', full_name_elv: '@full_name_elv', etablissement_code: '@etablissement_code', classe_id: '@classe_id', uid_adm: '@uid_adm', full_name_adm: '@full_name_adm', profil_adm: '@profil_adm', with_model: '@with_model'}, {'post': {method: 'POST'}});
}])
.factory('CarnetsFact', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/', {uid_elv: '@uid_elv', id: '@id'}, {
		'get':    {method:'GET'}
	});
}])
.factory('CarnetsEvignal', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/evignal', {}, {
		'query':    {method:'GET', isArray:true}
	});
}])
.factory('CarnetPdf', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/:uid_elv/pdf', {uid_elv: '@uid_elv'}, {
		'post':    {method:'POST', responseType :'blob', params: {nom: '@nom', prenom: '@prenom', avatar: '@avatar', classe: '@classe', college: '@college', sexe: '@sexe', id_onglets: '@id_onglets'}}
	});
}])
.factory('CarnetPersonnelsEvignal', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/carnets/evignal/personnels', {uid_elv: '@uid_elv', hopital: '@hopital'});
}])
.factory('Onglets', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/onglets/', {uid: '@uid'}, {
		'get':    {method:'GET'},
		'tabs':   {method:'GET', url: APP_PATH + '/api/onglets/tabs'},
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
		'update': {method:'PUT', url: APP_PATH + '/api/entrees/:id', params: {id: '@id', contenu: '@contenu', avatar: '@avatar'}},
		'update_avatar': {method:'PUT', url: APP_PATH + '/api/entrees/:uid/avatar', params: {uid: '@uid', avatar: '@avatar'}},
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
		'carnets':  {method:'GET', isArray:false, url: APP_PATH + '/api/rights/carnets/:uid_elv', params: {uid_elv: '@uid_elv', evignal: '@evignal'}},
		'users':  {method:'GET', isArray:false, url: APP_PATH + '/api/rights/users/:uid', params: {uid: '@uid', uid_elv: '@uid_elv', carnet_id: '@carnet_id'}},
		'update': {method:'PUT', url: APP_PATH + '/api/rights/:id', params: {id: '@id', read: '@read', write: '@write', admin: '@admin'}},
		'delete': {method:'DELETE', url: APP_PATH + '/api/rights/:id', params: {id: '@id'}}
	});
}])
.factory('Public', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/public/', {id: '@url_pub'}, {
		'get':    {method:'GET'},
		'post': {method:'POST', url: APP_PATH + '/api/public/carnets/:uid_elv', params: {uid_elv: '@uid_elv', id_onglets: '@id_onglets'}},
		'delete': {method:'DELETE', url: APP_PATH + '/api/public/carnets/:uid_elv', params: {uid_elv: '@uid_elv'}},
	});
}]);


angular.module('suiviApp')
.service('Carnets',['GRID_COLOR', 'Create', 'CurrentUser', 'CarnetsFact', 'LACLASSE_PATH', 'CreateEvignal', 'UAI_EVIGNAL', function(GRID_COLOR, Create, CurrentUser, CarnetsFact, LACLASSE_PATH, CreateEvignal, UAI_EVIGNAL){
	this.get = function(params){
		return CarnetsFact.get(params);
	}
	this.get_by_name = function(reponse){
		var carnets = [];
		var i = 0;
		angular.forEach(reponse, function (carnet) {
			carnet.couleur = GRID_COLOR[i%GRID_COLOR.length];
			carnet.avatar = LACLASSE_PATH + '/' + carnet.avatar;
			carnets.push(carnet);
			i++;
		});
		while (i < 16 || i % 4 != 0){
			carnets.push({id: null, couleur: GRID_COLOR[i%GRID_COLOR.length], uid_elv: null, firstName: '', lastName: '', classe: '', classe_id: null, etablissement_code: null, etablissement_nom: null, avatar: '', active: false});
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
			carnet.avatar = LACLASSE_PATH + '/' + carnet.avatar;
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

	this.create = function(carnet, with_model){
		var currentUser = CurrentUser.get();
		var roleUser = {name: 'ELV_ETB', priority: 0};
		_.each(currentUser.roles, function(role){
			if (role.etablissement_code_uai == carnet.etablissement_code && role.priority > roleUser.priority){
				roleUser.name = role.role_id;

			}
		});
		var full_name_adm = currentUser.prenom + " " + currentUser.nom.toLowerCase(); 
		var profil = "admin";
		switch(roleUser.name){
			case 'DIR_ETB':
				profil = 'directeur';
				break;
			case 'PROF_ETB':
				profil = 'prof';
				break;
		};
		return Create.post({uid_elv: carnet.uid_elv, full_name_elv: carnet.firstName + " " + carnet.lastName.toLowerCase(), etablissement_code: carnet.etablissement_code, classe_id: carnet.classe_id, uid_adm: currentUser.id_ent, full_name_adm: full_name_adm, profil_adm: profil, with_model: with_model});
	};

	this.createEvignal = function(carnet, with_model){
		var currentUser = CurrentUser.get();
		var roleUser = {name: 'ELV_ETB', priority: 0};
		_.each(currentUser.roles, function(role){
			if (role.etablissement_code_uai == UAI_EVIGNAL && role.priority > roleUser.priority){
				roleUser.name = role.role_id;
			}
		});
		var full_name_adm = currentUser.prenom + " " + currentUser.nom.toLowerCase(); 
		var profil = "admin";
		switch(roleUser.name){
			case 'DIR_ETB':
				profil = 'directeur';
				break;
			case 'PROF_ETB':
				profil = 'prof';
				break;
		};
		return CreateEvignal.post({uid_elv: carnet.uid_elv, full_name_elv: carnet.firstName + " " + carnet.lastName.toLowerCase(), etablissement_code: carnet.etablissement_code, classe_id: carnet.classe_id, uid_adm: currentUser.id_ent, full_name_adm: full_name_adm, profil_adm: profil, with_model: with_model});
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
