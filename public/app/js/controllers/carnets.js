'use strict';

angular.module('suiviApp')
    .controller( 'CarnetsCtrl',
                 [ '$scope', '$rootScope', '$state', '$stateParams', 'Carnets', 'GetByClasse', 'Rights', 'CurrentUser', 'Notifications',
                   function( $scope, $rootScope, $state, $stateParams, Carnets, GetByClasse, Rights, CurrentUser, Notifications ) {
                       GetByClasse.get( { id: $stateParams.classe_id } ).$promise
                           .then( function( response ) {
                               if ( response.error != undefined ) {
                                   Notifications.add( response.error, "error" );
                                   $scope.classe_carnets = Carnets.get_by_classe( { classe: {}, carnets: [] } );
                               } else {
                                   $scope.classe_carnets = Carnets.get_by_classe( response );
                               };
                           } );

                       $scope.open = function( carnet ) {
                           CurrentUser.getRightsRequest( carnet.uid_elv ).$promise
                               .then( function( right ) {
                                   CurrentUser.setRights( right );
                                   carnet.uai = carnet.etablissement_code;
                                   if ( CurrentUser.verifRights( carnet, carnet.uid_elv, 'read' ) == true ) {
                                       $state.go( 'suivi.carnet',
                                                  { classe_id: carnet.classe_id, id: carnet.uid_elv },
                                                  { reload: true, inherit: true, notify: true } );
                                   };
                               } );
                       };
                   } ] );
