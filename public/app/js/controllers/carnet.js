'use strict';

/* Controllers */

angular.module( 'suiviApp' )
    .controller( 'CarnetCtrl',
                 [ '$rootScope', '$scope', '$stateParams', '$modal',
                   'Onglet', 'Entrees', 'Carnets', 'Annuaire', 'CurrentUser',
                   'AVATAR_DEFAULT', 'AVATAR_M', 'AVATAR_F', 'URL_ENT', 'APP_PATH',
                   'Rights', '$state', 'Profil', '$window', '$http', '$timeout', 'textAngularManager', 'Notifications',
                   function( $rootScope, $scope, $stateParams, $modal,
                             Onglet, Entrees, Carnets, Annuaire, CurrentUser,
                             AVATAR_DEFAULT, AVATAR_M, AVATAR_F, URL_ENT, APP_PATH,
                             Rights, $state, Profil, $window, $http, $timeout, textAngularManager, Notifications ) {
                       Profil.initRights( $stateParams.id ).promise.then( function () {
                           $rootScope.docs = [];

                           $scope.deleteDoc = function ( doc, id_carnet ) {
                               $rootScope.docs = _.reject( $rootScope.docs, function ( d ) {
                                   if ( doc.id != null ) {
                                       Entrees.deleteDoc( {
                                           id: doc.id,
                                           id_carnet: id_carnet
                                       } ).$promise.then( function success( reponse ) {
                                           if ( reponse.error != undefined ) {
                                               Notifications.add( reponse.error, "error" );
                                               return false;
                                           } else {
                                               Notifications.add( "le Document: " + doc.nom + ", a bien été supprimé.", "success" );
                                           }
                                       }, function error() {} );
                                   };
                                   return doc.md5 == d.md5;
                               } );
                           };

                           $scope.getDoc = function ( doc, id_carnet ) {
                               if ( doc.id != null ) {
                                   $http.get( APP_PATH + '/api/entrees/docs/' + doc.id + '?id_carnet=' + id_carnet, {
                                       'responseType': 'blob'
                                   } ).success( function ( data, status ) {
                                       var link = document.createElement( 'a' );
                                       link.href = window.URL.createObjectURL( data );
                                       link.download = doc.nom;
                                       link.click();
                                   } );
                               };
                           };

                           Onglet.get( {
                               uid: $stateParams.id
                           }, function ( reponse ) {
                               if ( reponse.error == undefined ) {
                                   var entrees = [];

                                   if ( reponse.onglets[ 0 ] != undefined ) {
                                       entrees = reponse.onglets[ 0 ].entrees;
                                       $window.sessionStorage.setItem( "id", reponse.onglets[ 0 ].carnet_id );
                                   };
                                   var avatars = Annuaire.avatars( entrees );
                                   _.each( reponse.onglets, function ( tab ) {
                                       _.each( tab.entrees, function ( entree ) {
                                           entree.date = new Date( entree.date );
                                           entree.owner.avatar = URL_ENT + '/' + avatars[ entree.owner.uid ];
                                       } );
                                   } );
                                   $scope.tabs = reponse.onglets;
                                   avatars.$promise.then( function ( reponse ) {
                                       _.each( $scope.tabs, function ( tab ) {
                                           _.each( tab.entrees, function ( entree ) {
                                               entree.owner.avatar = URL_ENT + '/' + reponse[ entree.owner.uid ];
                                           } );
                                       } );
                                   } );
                                   $scope.nameUser = $window.sessionStorage.getItem( "prenom" ) + " " + $window.sessionStorage.getItem( "nom" );
                               } else {
                                   Notifications.add( reponse.error, "error" );
                               };
                           } );

                           $scope.activeTab = function ( tab ) {
                               _.each( $scope.tabs, function ( t ) {
                                   if ( t.id == tab.id ) {
                                       t.active = true;
                                       var avatars = Annuaire.avatars( tab.entrees );
                                       avatars.$promise.then( function ( reponse ) {
                                           _.each( tab.entrees, function ( entree ) {
                                               entree.owner.avatar = URL_ENT + '/' + reponse[ entree.owner.uid ];
                                           } );
                                       } );
                                   } else {
                                       t.active = false;
                                   };
                               } );
                           };

                           $scope.changeNameTab = function ( tab ) {
                               if ( CurrentUser.getRights().profil == "parent" || CurrentUser.getRights().profil == "élève" || CurrentUser.getRights().admin == 0 ) {
                                   Notifications.add( "vous n'êtes pas autorisé à modifier l'onglet !", "warning" );
                                   return false;
                               }

                               Onglet.update( {
                                   id: tab.id,
                                   nom: tab.nom,
                                   ordre: tab.ordre
                               } ).$promise.then( function ( reponse ) {
                                   if ( reponse.error != undefined && reponse.error != null ) {
                                       Notifications.add( reponse.error, "error" );
                                   } else {
                                       _.each( $scope.tabs, function ( t ) {
                                           if ( t.id == tab.id ) {
                                               t.editable = false;
                                           };
                                       } );
                                   };
                               } );
                           };

                           $scope.addTab = function () {
                               if ( CurrentUser.getRights().profil == "parent" || CurrentUser.getRights().profil == "élève" || CurrentUser.getRights().admin == 0 ) {
                                   Notifications.add( "vous n'êtes pas autorisé à ajouter un onglet !", "warning" );
                                   return false;
                               }
                               var newTab = {
                                   id: null,
                                   carnet_id: null,
                                   ordre: null,
                                   owner: "",
                                   nom: "Nouvel onglet",
                                   editable: true,
                                   active: true,
                                   htmlcontent: "",
                                   modifEntree: null,
                                   entrees: []
                               };
                               Onglet.post( {
                                   uid: $stateParams.id,
                                   nom: newTab.nom
                               } ).$promise.then( function ( reponse ) {
                                   if ( reponse.error == undefined ) {
                                       newTab.id = reponse.id;
                                       newTab.carnet_id = reponse.carnet_id;
                                       newTab.ordre = reponse.ordre;
                                       newTab.owner = reponse.owner;
                                       $scope.activeTab( newTab );
                                       $scope.tabs.push( newTab );
                                       $window.sessionStorage.setItem( "id", reponse.carnet_id );
                                       Notifications.add( "Un nouvel onglet a été ajouté", "success" );
                                   } else {
                                       Notifications.add( reponse.error, "error" );
                                   };
                               } );
                           };

                           $scope.removeTab = function ( tab ) {
                               if ( CurrentUser.getRights().profil == "parent" || CurrentUser.getRights().profil == "élève" || CurrentUser.getRights().admin == 0 ) {
                                   Notifications.add( "vous n'êtes pas autorisé à supprimer l'onglet !", "warning" );
                                   return false;
                               }
                               Onglet.delete( {
                                   id: tab.id
                               } ).$promise.then( function ( reponse ) {
                                   if ( reponse.error != undefined && reponse.error != null ) {
                                       Notifications.add( reponse.error, "error" );
                                   } else {
                                       $scope.tabs = _.reject( $scope.tabs, function ( t ) {
                                           Notifications.add( "l'onglet '" + tab.nom + "' a été supprimé", "success" );
                                           return t.id == tab.id;
                                       } );
                                   };
                               } );
                           };

                           $scope.addEntree = function ( tab ) {
                               if ( CurrentUser.getRights().write == 0 ) {
                                   Notifications.add( "vous n'êtes pas autorisé à ajouter une entrée !", "warning" );
                                   return false;
                               }
                               if ( tab.htmlcontent.trim() == "" ) {
                                   Notifications.add( "Vous devez obligatoirement avoir du texte dans votre message !", "warning" );
                                   return false;
                               };
                               if ( tab.modifEntree == null ) {
                                   var owner = Annuaire.get_infos_of( CurrentUser.get(), $stateParams.classe_id );
                                   var entree = {
                                       id: null,
                                       owner: {
                                           uid: CurrentUser.get().id_ent,
                                           infos: owner.infos,
                                           avatar: CurrentUser.get().avatar,
                                           back_color: owner.back_color,
                                           avatar_color: owner.avatar_color
                                       },
                                       contenu: tab.htmlcontent,
                                       docs: [],
                                       date: Date.now()
                                   };
                                   Entrees.post( {
                                       id_onglet: tab.id,
                                       carnet_id: tab.carnet_id,
                                       uid: entree.owner.uid,
                                       avatar: entree.owner.avatar,
                                       avatar_color: entree.owner.avatar_color,
                                       back_color: entree.owner.back_color,
                                       infos: entree.owner.infos,
                                       contenu: entree.contenu,
                                       docs: entree.docs
                                   } ).$promise.then( function ( reponse ) {
                                       if ( reponse.error != undefined && reponse.error != null ) {
                                           Notifications.add( reponse.error, "error" );
                                       } else {
                                           _.each( $scope.tabs, function ( t ) {
                                               if ( t.id == tab.id ) {
                                                   entree.id = reponse.id;
                                                   entree.owner.avatar = URL_ENT + '/' + entree.owner.avatar;
                                                   if ( $rootScope.docs.length > 0 ) {
                                                       if ( $rootScope.docs[ 0 ].cartable ) {
                                                           Entrees.postDoc( {
                                                               id_carnet: tab.carnet_id,
                                                               id_entree: entree.id,
                                                               file: $rootScope.docs[ 0 ].file
                                                           } ).$promise.then( function ( data ) {
                                                               if ( data.error == undefined ) {
                                                                   entree.docs = data.docs;
                                                                   t.entrees.push( entree );
                                                                   t.htmlcontent = "";
                                                                   $rootScope.docs = [];
                                                               } else {
                                                                   Notifications.add( reponse.error, "error" );
                                                               };
                                                           } );
                                                       } else {
                                                           // $upload.upload( {
                                                           //     url: APP_PATH + '/api/entrees/upload', //upload.php script, node.js route, or servlet url
                                                           //     method: 'POST',
                                                           //     // headers: {'Cookie': {suivi_api: JSON.stringify($cookies['suivi_api'])}},
                                                           //     withCredentials: true,
                                                           //     data: {
                                                           //         id_carnet: tab.carnet_id,
                                                           //         id_entree: entree.id
                                                           //     },
                                                           //     file: $rootScope.docs[ 0 ].file, // or list of files ($files) for html5 only
                                                           //     //fileName: 'doc.jpg' or ['$window.sessionStorage.getItem("prenom").jpg', '2.jpg', ...] // to modify the name of the file(s)
                                                           //     // customize file formData name ('Content-Disposition'), server side file variable name.
                                                           //     //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                                                           //     // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                                                           //     //formDataAppender: function(formData, key, val){}
                                                           // } ).success( function ( data, status, headers, config ) {
                                                           //     entree.docs = data.docs;
                                                           //     t.entrees.push( entree );
                                                           //     t.htmlcontent = "";
                                                           //     $rootScope.docs = [];
                                                           // } ).error( function ( reponse ) {
                                                           //     Notifications.add( reponse.error, "error" );
                                                           // } );
                                                       }
                                                   } else {
                                                       t.entrees.push( entree );
                                                       t.htmlcontent = "";
                                                   }
                                               };
                                           } );
                                           Notifications.add( "Votre message a été publié avec succés dans le carnet de suivi.", "success" );
                                       }
                                   } );
                               } else {
                                   Entrees.update( {
                                       id: tab.modifEntree,
                                       contenu: tab.htmlcontent,
                                       avatar: CurrentUser.get().avatar
                                   } ).$promise.then( function ( reponse ) {
                                       _.each( $scope.tabs, function ( t ) {
                                           if ( t.id == tab.id ) {
                                               _.each( t.entrees, function ( e ) {
                                                   if ( e.id == t.modifEntree ) {
                                                       e.contenu = t.htmlcontent;
                                                       e.owner.avatar = URL_ENT + '/' + CurrentUser.get().avatar;
                                                       if ( $rootScope.docs.length > 0 && $rootScope.docs[ 0 ].md5 == null ) {
                                                           if ( $rootScope.docs[ 0 ].cartable ) {
                                                               Entrees.postDoc( {
                                                                   id_carnet: tab.carnet_id,
                                                                   id_entree: e.id,
                                                                   file: $rootScope.docs[ 0 ].file
                                                               } ).$promise.then( function ( data ) {
                                                                   if ( data.error == undefined ) {
                                                                       e.docs = data.docs;
                                                                       t.modifEntree = null;
                                                                       t.htmlcontent = "";
                                                                       $rootScope.docs = [];
                                                                   } else {
                                                                       Notifications.add( reponse.error, "error" );
                                                                   };
                                                               } );
                                                           } else {
                                                               // $upload.upload( {
                                                               //     url: APP_PATH + '/api/entrees/upload', //upload.php script, node.js route, or servlet url
                                                               //     method: 'POST',
                                                               //     // headers: {'Cookie': {suivi_api: JSON.stringify($cookies['suivi_api'])}},
                                                               //     withCredentials: true,
                                                               //     data: {
                                                               //         id_carnet: tab.carnet_id,
                                                               //         id_entree: e.id
                                                               //     },
                                                               //     file: $rootScope.docs[ 0 ].file, // or list of files ($files) for html5 only
                                                               //     //fileName: 'doc.jpg' or ['$window.sessionStorage.getItem("prenom").jpg', '2.jpg', ...] // to modify the name of the file(s)
                                                               //     // customize file formData name ('Content-Disposition'), server side file variable name.
                                                               //     //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                                                               //     // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                                                               //     //formDataAppender: function(formData, key, val){}
                                                               // } ).success( function ( data, status, headers, config ) {
                                                               //     e.docs = data.docs;
                                                               //     t.modifEntree = null;
                                                               //     t.htmlcontent = "";
                                                               //     $rootScope.docs = [];
                                                               // } ).error( function ( reponse ) {
                                                               //     Notifications.add( reponse.error, "error" );
                                                               // } );
                                                           };
                                                       } else {
                                                           e.docs = $rootScope.docs;
                                                           t.modifEntree = null;
                                                           t.htmlcontent = "";
                                                           $rootScope.docs = [];
                                                           Notifications.add( "Votre message a été modifé avec succés dans le carnet de suivi.", "success" );
                                                       };
                                                   };
                                               } );
                                           };
                                       } );
                                   } );
                               };
                           };

                           $scope.editEntree = function ( tab, entree ) {
                               if ( entree.owner.uid != CurrentUser.get().id_ent && CurrentUser.getRights().admin == 0 ) {
                                   Notifications.add( "vous ne pouvez pas editer les entrées qui ne vous appartiennent pas !", "warning" );
                                   return false;
                               }
                               var editorScope = textAngularManager.retrieveEditor( 'text_' + tab.id ).scope;
                               $timeout( function () {
                                   editorScope.displayElements.text.trigger( 'focus' );
                               } );
                               _.each( $scope.tabs, function ( t ) {
                                   if ( t.id == tab.id ) {
                                       t.htmlcontent = entree.contenu;
                                       t.modifEntree = entree.id;
                                       $rootScope.docs = entree.docs;
                                   };
                               } );
                           }

                           $scope.removedEntree = function ( tab, entree ) {
                               if ( entree.owner.uid != CurrentUser.get().id_ent && CurrentUser.getRights().admin == 0 ) {
                                   Notifications.add( "vous ne pouvez pas supprimer les entrées qui ne vous appartiennent pas !", "warning" );
                                   return false;
                               }
                               _.each( entree.docs, function ( doc ) {
                                   Entrees.deleteDoc( {
                                       id: doc.id,
                                       id_carnet: tab.carnet_id
                                   } );
                               } );

                               Entrees.delete( {
                                   id: entree.id
                               } ).$promise.then( function ( reponse ) {
                                   if ( reponse.error != undefined && reponse.error != null ) {
                                       Notifications.add( reponse.error, "error" );
                                   } else {
                                       _.each( $scope.tabs, function ( t ) {
                                           if ( t.id == tab.id ) {
                                               t.entrees = _.reject( t.entrees, function ( e ) {
                                                   Notifications.add( "Votre message a été supprimé avec succés du carnet de suivi.", "success" );
                                                   return e.id == entree.id;
                                               } );
                                           }
                                       } );
                                   };
                               } );
                           };

                           $scope.sortableOptions = {
                               stop: function ( e, ui ) {
                                   for ( var index in $scope.tabs ) {
                                       $scope.tabs[ index ].ordre = index + 1;
                                       $scope.changeNameTab( $scope.tabs[ index ] );
                                   }
                               }
                           };

                           $scope.modalInstanceCtrl = function ( $scope, $modalInstance ) {

                               $scope.ok = function () {
                                   $modalInstance.close();
                               };

                               $scope.cancel = function () {
                                   $modalInstance.dismiss( 'cancel' );
                               };
                           };

                           $scope.open = function ( tab, entree, type ) {

                               var modalInstance = $modal.open( {
                                   templateUrl: 'myModalContent.html',
                                   controller: $scope.modalInstanceCtrl,
                                   size: 'sm'
                               } );

                               modalInstance.result.then( function () {
                                   switch ( type ) {
                                   case 'entree':
                                       $scope.removedEntree( tab, entree );
                                       break;
                                   case 'tab':
                                       $scope.removeTab( tab );
                                       break;
                                   }
                               } );
                           };
                       } );

    } ] );
