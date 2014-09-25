'use strict';

/* Directives */


angular.module('suiviApp').
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

//   angular.module('directives.bootstrap.tabset', [])
// .directive('tabset', ['$rootScope', function ($rootScope) {
//   return {
//     restrict: 'E',
//     replace: true,
//     transclude: true,
//     controller: function($scope) {
//       $scope.carnets = '';
//       $scope.groupesOrClasses = '';
//       var tabs = $scope.tabs = [];
//       var controller = this;
 
//       this.selectTab = function (tab) {
//         angular.forEach(tabs, function (tab) {
//           tab.selected = false;
//         });
//         tab.selected = true;
//       };
 
//       this.setCarnets = function (carnets) {
//         $scope.carnets = carnets;
//         if(carnets[0] != null){
//           console.log(carnets[0]);
//           if(carnets[0].classe != null){
//             console.log("classes");
//             $rootScope.carnetsClasses = carnets;
//             $scope.groupesOrClasses = 'carnetsClasses';         
//           }
//           if(carnets[0].groupe != null){
//             console.log("groupes");
//             $rootScope.carnetsGroupes = carnets;
//             $scope.groupesOrClasses = 'carnetsGroupes';          
//           }
//         }
//       };
 
//       this.addTab = function (tab) {
//         if (tabs.length == 0) {
//           controller.selectTab(tab);
//         }
//         tabs.push(tab);
//       };
//     },
//     template:
//       '<div class="row-fluid">' +
//         '<div class="row-fluid">' +
//           '<div class="nav nav-tabs" ng-transclude></div>' +
//         '</div>' +
//         '<div class="row-fluid">' +
//           '<pre ng-controller="ListCarnetsCtrl">' +
//             '<ul class="carnets">' +
//               '<li ng-repeat="carnet in '+$scope.groupesOrClasses+'" ng-dblclick="openCarnet(carnet)" class="carnet">' +
//                 '<div class="carnet-title">' +
//                   '<h3>{{carnet.title}}</h3>' +        
//                 '</div>' +
//                 '<div class="carnet-attributs">' +
//                   '<p><strong>{{carnet.prenom}}</strong></p>' +
//                   '<p><strong>{{carnet.nom}}</strong></p>' +
//                   '<p><strong>{{carnet.etablissement}}</strong></p>' +
//                   '<p><strong>{{carnet.classe}}</strong></p> ' +
//                 '</div>' +
//               '</li>' +
//             '</ul>' +
//           '</pre>' +
//         '</div>' +
//       '</div>'
//   };
// }])
// .directive('tab', ['$rootScope', '$http', 'BASE_SERVICE_URL', 'SERVICE_CARNETS', function ($rootScope, $http, BASE_SERVICE_URL, SERVICE_CARNETS) {
//   return {
//     restrict: 'E',
//     replace: true,
//     require: '^tabset',
//     scope: {
//       title: '@',
//       id: '@',
//       carnets: '@'
//     },
//     link: function(scope, element, attrs, tabsetController) {
//       tabsetController.addTab(scope);
 
//       scope.select = function () {
//         tabsetController.selectTab(scope);
//       }
 
//       scope.$watch('selected', function () {
//         if (scope.selected) {
//           $http.get(BASE_SERVICE_URL + SERVICE_CARNETS + '/regroupements/' + $rootScope.current_user.info.uid + '/' + scope.id).success(function(data){
//             scope.carnets = data;
//             tabsetController.setCarnets(scope.carnets);
//           });
//         }
//       });
//     },
//     template:
//       '<li ng-class="{active: selected}">' +
//         '<a href="" ng-click="select()">{{ title }}</a>' +
//       '</li>'
//   };
// }]);
