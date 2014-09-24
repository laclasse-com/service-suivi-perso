angular.module('suiviApp')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
          .state('404', {
             url: '/404',
             templateUrl: '/app/views/generals/404.html'
            })
          .state( 'suivi',{
            abstract:true,
            templateUrl:'/app/views/generals/index.html'})

          .state( 'suivi.classes',{
            resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA', 'EVS', 'DOC'] ); } },
            parent: 'suivi',
            url: '/classes',
            views: {
              'aside': {
                templateUrl:'/app/views/generals/lists/asides/aside-lists.html',
                controller: 'AsideCtrl'
              },
              'main': {
                templateUrl:'/app/views/generals/lists/mains/classes/main-classes.html',
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
                templateUrl:'/app/views/generals/lists/asides/aside-lists.html',
                controller: 'AsideCtrl'
              },
              'main': {
                templateUrl:'/app/views/generals/lists/mains/carnets/main-carnets.html',
                controller: 'CarnetsCtrl'
               }
              }
            })

           .state( 'suivi.add',
             { url: '/carnets/add/:name',
              resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA',] ); } },
               views: {
                   'aside': {
                 templateUrl:'/app/views/generals/lists/asides/aside-lists.html',
                 controller: 'AsideCtrl'
                   },
                   'main': {
                 templateUrl:'/app/views/generals/lists/mains/carnets/main-add-carnets.html',
                 controller: 'AddCarnetsCtrl'
                   }
               }
             })

           .state( 'suivi.carnet',
             { url: '/classes/:classe_id/carnets/:id',
              resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA', 'EVS', 'DOC', 'ELV', 'TUT'] ); } },
               views: {
                   'aside': {
                 templateUrl:'/app/views/generals/carnet-eleve/aside-carnet-eleve.html',
                 controller: 'AsideCarnetCtrl'
                   },
                   'main': {
                 templateUrl:'/app/views/generals/carnet-eleve/main-carnet-eleve.html',
                 controller: 'CarnetCtrl'
                   }
               }
             })

           .state( 'suivi.rights',
             { url: '/classes/:classe_id/carnets/:id/rights',
                resolve: { auth: function( Profil ) { Profil.redirection( ['ENS', 'DIR', 'ETA',] ); } },
               views: {
                   'aside': {
                 templateUrl:'/app/views/generals/carnet-eleve/aside-carnet-eleve.html',
                 controller: 'AsideCarnetCtrl'
                   },
                   'main': {
                 templateUrl:'/app/views/generals/carnet-eleve/main-rights-carnet-eleve.html',
                 controller: 'RightsCtrl'
                   }
               }
             });

  $urlRouterProvider.otherwise('/classes');
}]);
