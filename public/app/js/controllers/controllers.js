'use strict';

/* Controllers */
function RootCtrl($scope, $rootScope, Notifications){

  // $rootScope.racine_images = '/bower_components/laclasse-common-client/images/';

  // $rootScope.couleurs = [ 'bleu',
  //    'vert',
  //    'rouge',
  //    'violet',
  //    'orange',
  //    'jaune',
  //    'gris1',
  //    'gris2',
  //    'gris3',
  //    'gris4' ];

  //initialize application prefix for images and css 
  // $rootScope.app_prefix = APPLICATION_PREFIX_URL;
  // //initialisation de l'utilisateur.
  // $rootScope.initCurrentUser = function(){
  //   User.init(BASE_SERVICE_URL, SERVICE_ANNUAIRE+'/user/session');
  //   currentUser.set_current_user($rootScope.current_user);
  // }
  // Svg.modifyFill("logolaclasse", "white");
};
RootCtrl.$inject=['$scope', '$rootScope', 'Notifications'];