angular.module('suiviApp')
.config(['$stateProvider', '$urlRouterProvider', 'APP_PATH', function($stateProvider, $urlRouterProvider, APP_PATH) {
  
  $stateProvider
          .state('404', {
             url: '/404',
             templateUrl: APP_PATH + '/app/views/generals/404.html'
            })
          .state( 'suivi',{
            abstract:true,
            templateUrl:APP_PATH + '/app/views/generals/index.html'})

          .state( 'suivi.classes',{
            resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA', 'EVS', 'DOC'] ); } },
            parent: 'suivi',
            url: '/classes',
            views: {
              'aside': {
                templateUrl:APP_PATH + '/app/views/generals/lists/asides/aside-lists.html',
                controller: 'AsideCtrl'
              },
              'main': {
                templateUrl:APP_PATH + '/app/views/generals/lists/mains/classes/main-classes.html',
                controller: 'ClassesCtrl'
               }
              }
            })

          .state( 'suivi.carnets',{
            parent: 'suivi',
            resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA', 'EVS', 'DOC'] ); } },
            url: '/classes/:classe_id/carnets',
            views: {
              'aside': {
                templateUrl:APP_PATH + '/app/views/generals/lists/asides/aside-lists.html',
                controller: 'AsideCtrl'
              },
              'main': {
                templateUrl:APP_PATH + '/app/views/generals/lists/mains/carnets/main-carnets.html',
                controller: 'CarnetsCtrl'
               }
              }
            })

           .state( 'suivi.add',
             { url: '/carnets/add/:name',
              resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA',] ); } },
               views: {
                   'aside': {
                 templateUrl:APP_PATH + '/app/views/generals/lists/asides/aside-lists.html',
                 controller: 'AsideCtrl'
                   },
                   'main': {
                 templateUrl:APP_PATH + '/app/views/generals/lists/mains/carnets/main-add-carnets.html',
                 controller: 'AddCarnetsCtrl'
                   }
               }
             })

           .state( 'suivi.carnet',
             { url: '/classes/:classe_id/carnets/:id',
              resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA', 'EVS', 'DOC', 'ELV', 'TUT'] ); } },
               views: {
                   'aside': {
                 templateUrl:APP_PATH + '/app/views/generals/carnet-eleve/aside-carnet-eleve.html',
                 controller: 'AsideCarnetCtrl'
                   },
                   'main': {
                 templateUrl:APP_PATH + '/app/views/generals/carnet-eleve/main-carnet-eleve.html',
                 controller: 'CarnetCtrl'
                   }
               }
             })

           .state( 'suivi.rights',
             { url: '/classes/:classe_id/carnets/:id/rights',
                resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA',] ); } },
               views: {
                   'aside': {
                 templateUrl:APP_PATH + '/app/views/generals/carnet-eleve/aside-carnet-eleve.html',
                 controller: 'AsideCarnetCtrl'
                   },
                   'main': {
                 templateUrl:APP_PATH + '/app/views/generals/carnet-eleve/main-rights-carnet-eleve.html',
                 controller: 'RightsCtrl'
                   }
               }
             });

  $urlRouterProvider.otherwise('/classes');
}]);
