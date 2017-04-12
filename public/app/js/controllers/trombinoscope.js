angular.module( 'suiviApp' )
    .controller( 'TrombinoscopeCtrl',
                 [ '$scope', '$q', 'URL_ENT', 'APP_PATH', 'User', 'APIs',
                   function( $scope, $q, URL_ENT, APP_PATH, User, APIs ) {
                       var ctrl = $scope;
                       ctrl.search = '';

                       User.get().$promise
                           .then( function( current_user ) {
                               if ( current_user.profil_actif.profil_id === 'ELV' ) {
                                   ctrl.eleves = [ current_user ];
                               } else {
                                   $q.all( _.chain( current_user.classes )
                                           .select( function( regroupement ) {
                                               return _(regroupement).has('etablissement_code') && regroupement.etablissement_code === current_user.profil_actif.etablissement_code_uai;
                                               } )
                                               .map( function( regroupement ) {
                                                   return _(regroupement).has('classe_id') ? regroupement.classe_id : regroupement.groupe_id;
                                               } )
                                               .uniq()
                                               .map( function( regroupement_id ) {
                                                   return APIs.get_regroupement( regroupement_id );
                                               } )
                                               .value()
                                         )
                                       .then( function success( response ) {
                                           ctrl.eleves = _.chain(response)
                                               .pluck('data')
                                               .map( function( regroupement ) {
                                                   return _(regroupement.eleves)
                                                       .map( function( eleve ) {
                                                           eleve.avatar = URL_ENT + ( _(eleve.avatar.match(/^user/)).isNull() ? '' : 'api/avatar/' ) + eleve.avatar;
                                                           eleve.regroupement = { id: regroupement.id,
                                                                                  libelle: regroupement.libelle_aaf,
                                                                                  type: regroupement.type_regroupement_id };
                                                           eleve.etablissement = regroupement.etablissement;
                                                           eleve.enseignants = regroupement.profs;

                                                           return eleve;
                                                       } );
                                               } )
                                               .flatten()
                                               .value();

                                           APIs.query_carnets_contributed_to( current_user.id_ent )
                                               .then( function success( response ) {
                                                   ctrl.eleves_contributed = _.chain(response.data).map( function( carnet ) {
                                                       return _(ctrl.eleves).findWhere({ id_ent: carnet.uid_elv });
                                                   }).compact().value();
                                               },
                                                      function error( response ) {} );
                                       },
                                              function error( response ) {} );
                               }
                           } );
                   } ] );
