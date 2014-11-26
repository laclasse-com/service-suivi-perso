'use strict';

angular.module('suiviApp')
.factory('Classes', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/annuaire/classes', {});
}])
.factory('GetCurrentUser', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/annuaire/currentuser', {});
}])
.factory('GetUser', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/annuaire/users/:id', {id: '@id'});
}])
.factory('GetRegroupement', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/annuaire/regroupements/:id', {id: '@id'});
}])
.factory('GetPersonnelsEtablissements', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/annuaire/etablissements/:uai/personnels', {uai: '@uai', uid_elv: '@uid_elv'});
}])
.factory('GetPersonnelsEvignal', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/annuaire/evignal/:uai/personnels', {uai: '@uai', uid_elv: '@uid_elv'});
}])
.factory('GetAvatars', ['$resource', 'APP_PATH', function( $resource, APP_PATH ) {
	return $resource( APP_PATH + '/api/annuaire/avatars', {}, {
		'post':    {method:'POST', params: {uids: '@uids'}}
	});
}]);

angular.module('suiviApp')
.service('Annuaire',[ 'GetCurrentUser', 'GRID_COLOR', 'Donnee', 'GetAvatars',
	function(GetCurrentUser, GRID_COLOR, Donnee, GetAvatars){
	this.get_classes = function (response) {
		var classes = [];
		var i = 0;
		angular.forEach(response, function (classe) {
			classes.push({id: classe.classe_id, couleur: GRID_COLOR[i%GRID_COLOR.length], name: classe.classe_libelle, college: classe.etablissement_nom, collegeId: classe.etablissement_id, college_code: classe.etablissement_code});
			i++;
		});
		while (i < 16 || i % 4 != 0){
			classes.push({id: null, couleur: GRID_COLOR[i%GRID_COLOR.length], name: '', college: '', collegeId: null});
			i++;
		}
		return classes;
	};

	this.get_user = function(reponse){
		return {
			id_ent: reponse.id_ent,
			fullname: reponse.prenom + " " + reponse.nom.toLowerCase(),
			nom: reponse.nom,
			prenom: reponse.prenom,
			done: false,
			classe: {
				libelle: reponse.classes[0].classe_libelle,
				nom_etablissement: reponse.classes[0].etablissement_nom,
				etablissement_code: reponse.classes[0].etablissement_code
			},
			date_naissance: reponse.date_naissance,
			sexe: reponse.sexe,
			email: Donnee.tri_emails(reponse.emails),
			parents: reponse.parents,
			avatar: reponse.avatar
		};
	};

	this.get_parent = function(reponse){
		return {
			id_ent: reponse.id_ent,
			fullname: reponse.prenom + " " + reponse.nom.toLowerCase(),
			adresse: reponse.adresse,
			ville: reponse.ville,
			telephones: Donnee.tri_telephones(reponse.telephones),
			done: false,
			email: Donnee.tri_emails(reponse.emails),
		};
	};

	this.get_contact_college = function(reponse){
		var contacts = [];
		angular.forEach(reponse, function (prof) {
			if(prof.prof_principal == "O"){
				contacts.push({
					id_ent: prof.id_ent,
					matiere: "professeur principal",
					fullname: prof.prenom + " " + prof.nom.toLowerCase(),
					done: false
				});
			} else {
				contacts.push({
					id_ent: prof.id_ent,
					matiere: prof.matieres[0].libelle_long.toLowerCase(),
					fullname: prof.prenom + " " + prof.nom.toLowerCase(),
					done: false
				});
			}
		});
		return contacts;
	}

	this.get_contact_hopital = function(reponse){
		var contacts = [];
		angular.forEach(reponse, function (prof) {
			var profil = ""
			switch(prof.profil){
				case 'directeur':
					profil = "directeur";
					break;
				case 'admin':
					profil = "administrateur";
					break;
				case 'cpe':
					profil = "conseiller principal d'éducation";
					break;
				case 'avs':
					profil = "assistante de vie scolaire";
					break;
				case 'prof':
					profil = "enseignant";
					break;
			}
			contacts.push({
				id_ent: prof.id_ent,
				matiere: profil,
				fullname: prof.fullname.toLowerCase(),
				done: false
			});
		});
		return contacts;
	}

	this.get_current_user = function(){
		return GetCurrentUser.get();
	};

	this.get_infos_of = function(user, classe_id){
		var infos = "";
		var avatarColor = "rgba(235,84,84,0.7)";
		var backColor = "rgba(232,194,84,0.9)";
		var etab = "";
		var matiere = "";
		var prof_p = "N";
		var classe_lib = "";
		_.each(user.classes, function(classe){
			if (classe_id == classe.classe_id) {
				etab = classe.etablissement_nom.toLowerCase();
				if (classe.matiere_libelle != undefined) {matiere = classe.matiere_libelle.toLowerCase();};
				prof_p = classe.prof_principal;
				classe_lib = classe.classe_libelle;
			};
		});
		if (matiere.length > 20) {
			matiere = matiere.substr(0, 20) + "...";
		};
		switch ( user.profil_id ) {
			case 'DIR':
	            infos = user.prenom + " " + user.nom.toLowerCase() + " - directeur - " + etab;
	            avatarColor = "rgba(128,186,102,0.7)";
	            backColor = "rgba(235,84,84,0.3)";
	            break;
			case 'ETA':
				infos = user.prenom + " " + user.nom.toLowerCase() + " - administrateur - " + etab;
				avatarColor = "rgba(128,186,102,0.7)";
	            backColor = "rgba(235,84,84,0.3)";
				break;
			case 'EVS':
				infos = user.prenom + " " + user.nom.toLowerCase() + " - cpe - " + etab;
				avatarColor = "rgba(128,186,102,0.7)";
	            backColor = "rgba(235,84,84,0.3)";
				break;
			// case 'CPE':
			// 	infos = user.prenom + " " + user.nom.toLowerCase() + " - cpe - " + etab;
			// 	avatarColor = "rgba(128,186,102,0.7)";
	  //           backColor = "rgba(235,84,84,0.3)";
			// 	break;
			case 'ENS':
				if (prof_p == 'O') {
					infos = user.prenom + " " + user.nom.toLowerCase() + " - " + matiere + " - professeur principal";
					avatarColor = "rgba(156,117,171,0.7)";
	            	backColor = "rgba(26,161,204,0.3)";
				} else {
					infos = user.prenom + " " + user.nom.toLowerCase() + " - " + matiere + " - professeur";
					avatarColor = "rgba(26,161,204,0.7)";
	            	backColor = "rgba(156,117,171,0.3)";
				};
				break;
			case 'DOC':
				infos = user.prenom + " " + user.nom.toLowerCase() + " - documentaliste - " + etab;
				avatarColor = "rgba(128,186,102,0.7)";
	            backColor = "rgba(235,84,84,0.3)";
				break;
			case 'ELV':
				infos = user.prenom + " " + user.nom.toLowerCase() + " - " + classe_lib + " - " + etab;
				break;
			case 'TUT':
				infos = user.prenom + " " + user.nom.toLowerCase() + " - parent";
				avatarColor = "rgba(156,117,171,0.9)";
	            backColor = "rgba(128,186,102,0.3)";
				break;
		}
		return {infos: infos, avatar_color: avatarColor, back_color: backColor};
	};

	this.get_personnels = function(users){
		var list = [
			{
				type: "Administrateurs",
				open: true,
				users: []
			},
			{
				type: "Profs",
				open: false,
				users: []
			},
			{
				type: "CPE",
				open: false,
				users: []
			},
			{
				type: "Famille",
				open: false,
				users: []
			},
			{
				type: "Autres",
				open: false,
				users: []
			}
		];

		_.each(users, function(u){
			switch(u.role_id){
				case 'DIR_ETB':
					list[4].users.push({
						id:u.id_ent,
						id_right: null,
						full_name: u.prenom + " " + u.nom.toLowerCase(),
						profil: "directeur",
						r: true,
						w: false,
						admin: false,
						hopital: false,
						evignal: false,
						action: []
					});
					break;
				case 'ADM_ETB':
					list[0].users.push({
						id:u.id_ent,
						id_right: null,
						full_name: u.prenom + " " + u.nom.toLowerCase(),
						profil: "admin",
						r: true,
						w: true,
						admin: true,
						hopital: false,
						evignal: false,
						action: []
					});
					break;
				case 'CPE_ETB':
					list[2].users.push({
						id:u.id_ent,
						id_right: null,
						full_name: u.prenom + " " + u.nom.toLowerCase(),
						profil: "cpe",
						r: true,
						w: false,
						admin: false,
						hopital: false,
						evignal: false,
						action: []
					});
					break;
				case 'PROF_ETB':
					list[1].users.push({
						id:u.id_ent,
						id_right: null,
						full_name: u.prenom + " " + u.nom.toLowerCase(),
						profil: "prof",
						r: true,
						w: false,
						admin: false,
						hopital: false,
						evignal: false,
						action: []
					});
					break;
				case 'AVS_ETB':
					list[4].users.push({
						id:u.id_ent,
						id_right: null,
						full_name: u.prenom + " " + u.nom.toLowerCase(),
						profil: "avs",
						r: true,
						w: false,
						admin: false,
						hopital: false,
						evignal: false,
						action: []
					});
					break;
				case 'ELV_ETB':
					list[3].users.push({
						id:u.id_ent,
						id_right: null,
						full_name: u.prenom + " " + u.nom.toLowerCase(),
						profil: "élève",
						r: true,
						w: false,
						admin: false,
						hopital: false,
						evignal: false,
						action: []
					});
					break;
				case 'PAR_ETB':
					list[3].users.push({
						id:u.id_ent,
						id_right: null,
						full_name: u.prenom + " " + u.nom.toLowerCase(),
						profil: "parent",
						r: true,
						w: false,
						admin: false,
						hopital: false,
						evignal: false,
						action: []
					});
					break;
				default:
					break;
			}
		});
	return list;
	}; 
	this.avatars = function(entrees){
		var entreesUniq = _.uniq(entrees, false, function(entree){
          return entree.owner.uid;
        });
        var uids = [];
        _.each(entreesUniq, function(entree){
        	uids.push(entree.owner.uid);
        });
        return GetAvatars.post({uids: uids});
	};
}]);
