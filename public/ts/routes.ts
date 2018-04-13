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
        .state('student',
               {
          url: '/student/:uids',
          params: { uids: { array: true } },
          component: 'student',
          resolve: {
            uids: ['$transition$',
              function($transition$) {
                return $transition$.params().uids;
              }]
          }
        });
    }]);
