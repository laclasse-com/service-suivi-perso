angular.module( 'suiviApp' )
    .config( [ '$stateProvider', '$urlRouterProvider', 'APP_PATH', 'cfpLoadingBarProvider', 'ngClipProvider',
               function( $stateProvider, $urlRouterProvider, APP_PATH, cfpLoadingBarProvider, ngClipProvider ) {
                   ngClipProvider.setPath(APP_PATH + "/app/node_modules/zeroclipboard/dist/ZeroClipboard.swf");
                   cfpLoadingBarProvider.includeBar = false;

                   $stateProvider
                   // /////////// Normal
                       .state( 'suivi',
                               { abstract:true,
                                 templateUrl: APP_PATH + '/app/views/index.html' } )
                       .state( 'suivi.classes',
                               { resolve: { auth: function( Profil ) { Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH', 'AVS_ETB', 'CPE_ETB'], false ); } },
                                 parent: 'suivi',
                                 url: '/classes',
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-lists.html',
                                                     controller: 'AsideCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/list-regroupements.html',
                                                    controller: 'ClassesCtrl' } } } )
                       .state( 'suivi.carnets',
                               { parent: 'suivi',
                                 resolve: { auth: function( Profil ) { Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH', 'AVS_ETB', 'CPE_ETB'], false ); } },
                                 url: '/classes/:classe_id/carnets',
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-lists.html',
                                                     controller: 'AsideCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/list-carnets.html',
                                                    controller: 'CarnetsCtrl' } } } )
                       .state( 'suivi.add',
                               { url: '/carnets/add/:name',
                                 resolve: { auth: function( Profil ) { Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH'], false ); } },
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-lists.html',
                                                     controller: 'AsideCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/list-carnets-add-carnet.html',
                                                    controller: 'AddCarnetsCtrl' } } } )
                       .state( 'suivi.carnet',
                               { url: '/classes/:classe_id/carnets/:id',
                                 resolve: { auth: function( Profil, $stateParams ) {
                                     Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH', 'AVS_ETB', 'CPE_ETB', 'PAR_ETB', 'ELV_ETB'], false );
                                 } },
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-carnet-eleve.html',
                                                     controller: 'AsideCarnetCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/main-carnet-eleve.html',
                                                    controller: 'CarnetCtrl' } } } )
                       .state( 'suivi.rights',
                               { url: '/classes/:classe_id/carnets/:id/rights',
                                 resolve: { auth: function( Profil, $stateParams ) {
                                     Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH', 'AVS_ETB', 'CPE_ETB'], false );
                                 } },
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-carnet-eleve.html',
                                                     controller: 'AsideCarnetCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/main-rights-carnet-eleve.html',
                                                    controller: 'RightsCtrl' } } } )
                       .state( 'suivi.stats',
                               { parent: 'suivi',
                                 resolve: { auth: function( Profil ) { Profil.redirection( ['DIR_ETB', 'ADM_ETB', 'TECH'], false ); } },
                                 url: '/stats',
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-lists.html',
                                                     controller: 'AsideCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/list-stats.html',
                                                    controller: 'StatsCtrl' } } } )

                   // ////////// Collège Élie Vignal
                       .state( 'suivi.evignal_carnets',
                               { parent: 'suivi',
                                 resolve: { auth: function( Profil ) { Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH', 'AVS_ETB', 'CPE_ETB'], true ); } },
                                 url: '/evignal/carnets',
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-lists.html',
                                                     controller: 'AsideEvignalCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/evignal_list-carnets.html',
                                                    controller: 'CarnetsEvignalCtrl' } } } )
                       .state( 'suivi.evignal_add',
                               { url: '/evignal/carnets/add/:name',
                                 resolve: { auth: function( Profil ) { Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH'], true ); } },
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-lists.html',
                                                     controller: 'AsideEvignalCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/list-carnets-add-carnet.html',
                                                    controller: 'AddCarnetsEvignalCtrl' } } } )
                       .state( 'suivi.evignal_carnet',
                               { url: '/evignal/classes/:classe_id/carnets/:id',
                                 resolve: { auth: function( Profil, $stateParams ) {
                                     Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH', 'AVS_ETB', 'CPE_ETB', 'PAR_ETB', 'ELV_ETB'], true );
                                 } },
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/evignal_aside-carnet-eleve.html',
                                                     controller: 'AsideCarnetEvignalCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/main-carnet-eleve.html',
                                                    controller: 'CarnetCtrl' } } } )
                       .state( 'suivi.evignal_rights',
                               { url: '/evignal/classes/:classe_id/carnets/:id/rights',
                                 resolve: { auth: function( Profil, $stateParams ) {
                                     Profil.redirection( ['PROF_ETB', 'DIR_ETB', 'ADM_ETB', 'TECH', 'AVS_ETB', 'CPE_ETB'], true );
                                 } },
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/evignal_aside-carnet-eleve.html',
                                                     controller: 'AsideCarnetEvignalCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/evignal_main-rights-carnet-eleve.html',
                                                    controller: 'RightsEvignalCtrl' } } } )
                       .state( 'suivi.evignal_stats',
                               { parent: 'suivi',
                                 resolve: { auth: function( Profil ) { Profil.redirection( ['DIR_ETB', 'ADM_ETB', 'TECH'], true ); } },
                                 url: '/evignal/stats',
                                 views: { 'aside': { templateUrl: APP_PATH + '/app/views/aside-lists.html',
                                                     controller: 'AsideEvignalCtrl' },
                                          'main': { templateUrl: APP_PATH + '/app/views/evignal_list-stats.html',
                                                    controller: 'StatsEvignalCtrl' } } } )

                   // // ERREUR
                       .state( 'erreur',
                               { url: '/erreur/:code?message',
                                 templateUrl: APP_PATH + '/app/views/erreur.html',
                                 controller: 'ErreurCtrl' } );

                   $urlRouterProvider.otherwise( function( $injector, $location ) {
                       $location.path( "/evignal/carnets" );
                   } );
               } ] );
