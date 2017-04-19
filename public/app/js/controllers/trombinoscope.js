angular.module( 'suiviApp' )
    .controller( 'TrombinoscopeCtrl',
                 [ '$scope', '$state', '$q', 'URL_ENT', 'APP_PATH', 'APIs',
                   function( $scope, $state, $q, URL_ENT, APP_PATH, APIs ) {
                       var ctrl = $scope;
                       ctrl.search = '';
                       ctrl.only_display_contributed_to = false;

                       APIs.get_current_user()
                           .then( function( current_user ) {
                               if ( current_user.profil_actif.profil_id === 'ELV' ) {
                                   // ctrl.eleves = [ current_user ];
                                   $state.go( 'carnet', {uid_eleve: current_user.id_ent} );
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
                                                       return _(ctrl.eleves).findWhere({ id_ent: carnet.uid_eleve });
                                                   }).compact().value();

                                                   // var eleves_contributed_uids = _(ctrl.eleves_contributed).pluck('id_ent');

                                                   // _(ctrl.eleves).each( function( eleve ) {
                                                   //     eleve.contributed = _(eleves_contributed_uids).contains( eleve.id_ent );
                                                   // } );
                                               },
                                                      function error( response ) {} );
                                       },
                                              function error( response ) {} );
                               }
                           } );
                   } ] );
