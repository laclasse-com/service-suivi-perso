'use strict';

/* Controllers */

angular.module('suiviApp')
    .controller( 'AsideCtrl',
                 [ '$scope', '$state', '$stateParams', '$http', 'CurrentUser', 'APP_PATH',
                   function( $scope, $state, $stateParams, $http, CurrentUser, APP_PATH ) {
                       var ctrl = $scope;

                       ctrl.nameElv = $stateParams.name;
                       ctrl.erreur = "";
                       ctrl.accueil = "classes";

                       ctrl.return = function() {
                           $state.go( 'suivi.classes', {}, { reload: true, inherit: true, notify: true } );
                       };

                       ctrl.stats = function() {
                           $state.go( 'suivi.stats', {}, { reload: true, inherit: true, notify: true } );
                       };

                       ctrl.search = function( name ) {
                           if ( name != null && name != "" && name.length > 2 ) {
                               $state.go( 'suivi.add', {name: name}, { reload: true, inherit: true, notify: true } );
                           } else {
                               ctrl.erreur = "Au minimum trois caractères sont nécessaires pour effectuer une recherche !";
                           }
                       };

                       ctrl.delSearch = function() {
                           ctrl.nameElv ="";
                           ctrl.erreur = "";
                           $state.go( 'suivi.classes', {}, { reload: true, inherit: true, notify: true } );
                       };

                       if ( $state.current.name == 'suivi.classes' ) {
                           ctrl.backClassesDisplay = false;
                       } else {
                           ctrl.backClassesDisplay = true;
                       };

                       if ( $state.current.name == 'suivi.stats' ) {
                           ctrl.statsDisplay = false;
                       } else if ( CurrentUser.get() != null ) {
                           ctrl.statsDisplay = ["DIR_ETB", "ADM_ETB", "TECH"].indexOf(CurrentUser.get().hight_role) != -1 ;
                       } else {
                               ctrl.statsDisplay = true;
                           };

                       $http.get( APP_PATH + '/api/carnets/visible/' + CurrentUser.get().id_ent )
                           .then( function success( response ) {
                               ctrl.visible_carnets = response.data;
                           },
                                  function error( response ) {} );
                   } ] );
