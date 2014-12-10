'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('UploadTextAngularCtrl',['$modalInstance', '$scope',
  function($modalInstance, $scope) {
    $scope.img = {
      url: ''
    };
    $scope.submit = function() {
      $modalInstance.close($scope.img.url);
    };
  }
]);