angular.module('suiviApp')
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('trombinoscope',
        {
          url: '/',
          component: 'trombinoscope'
        })
        .state('carnet',
        {
          url: '/carnet/:uid_eleve',
          component: 'carnet',
          resolve: {
            uidEleve: ['$transition$',
              function($transition$) {
                if ($transition$.params().uid_eleve.split("%2C").length <= 1) {
                  return $transition$.params().uid_eleve;
                }
              }],
            uidsEleves: ['$transition$',
              function($transition$) {
                if ($transition$.params().uid_eleve.split("%2C").length > 1) {
                  return $transition$.params().uid_eleve.split("%2C");
                }
              }]
          }
        });
    }]);
