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
          url: '/carnet/:uids',
          params: { uids: { array: true } },
          component: 'carnet',
          resolve: {
            uids: ['$transition$',
              function($transition$) {
                return $transition$.params().uids;
              }]
          }
        });
    }]);
