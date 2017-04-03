'use strict';

/* Controllers */

angular.module('suiviApp')
    .controller( 'ErreurCtrl',
                 [ '$scope', '$stateParams',
                   function( $scope, $stateParams ) {
                       $scope.code = $stateParams.code;
                       $scope.message = $stateParams.message;
                   } ] );
