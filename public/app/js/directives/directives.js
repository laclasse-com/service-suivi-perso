'use strict';

/* Directives */


angular.module('suiviApp')
.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
.directive('noImage', ['URL_ENT', 'AVATAR_DEFAULT', function (URL_ENT, AVATAR_DEFAULT) {
    var setDefaultImage = function (el) {
        el.attr('src', URL_ENT + AVATAR_DEFAULT);
    };

    return { restrict: 'A',
             link: function (scope, el, attr) {
                 scope.$watch(function() {
                     return attr.ngSrc;
                 }, function () {
                     var src = attr.ngSrc;

                     if (!src) {
                         setDefaultImage(el);
                     }
                 });
             }
           };
}]);
