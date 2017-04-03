angular.module( 'suiviApp' )
    .controller( 'TrombinoscopeCtrl',
                 [ '$scope', '$http', '$q', 'URL_ENT', 'User', 'Etablissement',
                   function( $scope, $http, $q, URL_ENT, User, Etablissement ) {
                       var ctrl = $scope;
                       ctrl.search = '';

                       User.get().$promise
                           .then( function( current_user ) {
                               ctrl.current_user = current_user;

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
                                               return $http.get( URL_ENT + '/api/app/regroupements/' + regroupement_id, { params: { expand: 'true' } } );
                                           } )
                                           .value() )
                                       .then( function success( response ) {
                                           ctrl.eleves = _.chain(response)
                                               .pluck('data')
                                               .pluck('eleves')
                                               .flatten()
                                               .uniq()
                                               .each( function( eleve ) {
                                                   eleve.avatar = URL_ENT + ( _(eleve.avatar.match(/^user/)).isNull() ? '' : 'api/avatar/' ) + eleve.avatar;
                                               } )
                                               .value();
                                       },
                                              function error( response ) {} );
                               }
                           } );
                   } ] );
