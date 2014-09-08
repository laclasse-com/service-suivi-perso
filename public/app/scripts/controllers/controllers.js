'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  // .controller('ListCarnetsEVignalCtrl', ['$scope', '$rootScope', 'BASE_SERVICE_URL', 'SERVICE_CARNETS', '$http', '$location', 'User', 'Svg', 'EVIGNAL',
  //   function($scope, $rootScope, BASE_SERVICE_URL, SERVICE_CARNETS,$http, $location, User, Svg, EVIGNAL) {

  //   //on verifie que l'utilisateur est bien de E.VIGNAL
  //   User.verify($rootScope.current_user, EVIGNAL);

  //   $scope.admin = false;
  //   $scope.carnets = [];

  //   $scope.search = "";
 
  // 	/*Récupère tous les carnets d'un utilisateur*/
  // 	$http.get(BASE_SERVICE_URL+SERVICE_CARNETS+'/evignal/'+$rootScope.current_user.info.uid).success(function(data){
  // 		$scope.carnets = data;
  //     // for (var i = data.length - 1; i >= 0; i--) {
  //     //   Svg.modifyFill("carnet"+i, data[i].avatar);
  //     // };
  //   })

    
  // 	/*Quand un double click sur un carnet on charge la page d'un carnet*/
  // 	$scope.openCarnet = function(carnet){
  // 		$location.url('/carnet');
  // 	}
  //   $scope.create = function(){
  //     $http.get(BASE_SERVICE_URL + SERVICE_CARNETS + '/add/'+ $rootScope.current_user.info.uid).success(function(data){
  //       console.log(data);
  //     });
  //   }
  // }])
  // .controller('ListCarnetsCtrl', ['$scope', '$rootScope', '$http', 'BASE_SERVICE_URL', 'SERVICE_ANNUAIRE', 'SERVICE_CARNETS', 
  //   function($scope, $rootScope, $http, BASE_SERVICE_URL, SERVICE_ANNUAIRE, SERVICE_CARNETS) {
    
  //   $scope.regroupements = [];

  //   $scope.search = "";



  //   $http.get(BASE_SERVICE_URL + SERVICE_ANNUAIRE + '/regroupements/' + $rootScope.current_user.info.uid).success(function(data){
  //     $scope.regroupements = data;
  //   });

  //   /*Quand un double click sur un carnet on charge la page d'un carnet*/
  //   $scope.openCarnet = function(carnet){
  //     $location.url('/carnet');
  //   }

  //   $scope.delSearch = function(){
  //     $scope.search ="";
  //   }
  // }])
  .controller('AsideCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    $scope.nameElv = "";

    $scope.search = function(name){
      $location.url('/carnets/add/');

    }

    $scope.delSearch = function(){
      $scope.nameElv ="";
    }

  }])
  .controller('ClassesCtrl', ['$scope', '$rootScope', '$http', '$location','BASE_SERVICE_URL', 'SERVICE_ANNUAIRE', 'SERVICE_CARNETS', 
    function($scope, $rootScope, $http, $location, BASE_SERVICE_URL, SERVICE_ANNUAIRE, SERVICE_CARNETS) {

    $scope.open = function(classe){
      $rootScope.classe = classe;
      $location.url('/carnets/'+classe.id);
    }

    $scope.classes = 
    [ 
      {
        id: 1, 
        couleur: 'jaune',
        name: '5°3',
        college: 'collège Charpak'
      },
      { 
        id: 2,
        couleur: 'rouge',
        name: '5°5',
        college: 'collège Charpak'
      },
      { 
        id: 3,
        couleur: 'bleu',
        name: '4°3',
        college: 'collège Charpak'
      },
      { 
        id: 4,
        couleur: 'violet',
        name: '3°3',
        college: 'collège Charpak'
      },
      {
        id: 5,
        couleur: 'bleu',
        name: '3°A',
        college: 'collège Grignard'
      },
      { 
        id: 6,
        couleur: 'violet',
        name: '6°3',
        college: 'collège Charpak'
      },
      { 
        id: 7,
        couleur: 'vert',
        name: '6°5',
        college: 'collège Charpak'
      },
      { 
        id: 8,
        couleur: 'jaune',
        name: '',
        college: ''
      },
      { 
        id: 9,
        couleur: 'vert',
        name: '',
        college: ''
      },
      { 
        id: 10,
        couleur: 'jaune',
        name: '5°A',
        college: 'collège Grignard'
      },
      { 
        id: 11,
        couleur: 'rouge',
        name: '4°C',
        college: 'collège Grignard'
      },
      { 
        id: 12,
        couleur: 'bleu',
        name: '',
        college: ''
      },
      { 
        id: 13,
        couleur: 'rouge',
        name: '',
        college: ''
      },
      { 
        id: 14,
        couleur: 'bleu',
        name: '',
        college: ''
      },
      { 
        id: 15,
        couleur: 'violet',
        name: '',
        college: ''
      },
      { 
        id: 16,
        couleur: 'vert',
        name: '',
        college: ''
      } 
    ];
  }])
  .controller('AddCarnetsCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    $scope.open = function(carnet){
      $location.url('/carnet/'+carnet.id);
    }

    $scope.carnets = 
      [
        {
          id: 1,
          couleur: 'jaune',
          firstName: 'Sophie',
          lastName: 'Delaville',
          classe: '5°3',
          avatar: '/app/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg',
          active: true
        },
        { 
          id: 2,
          couleur: 'rouge',
          firstName: 'Sophie',
          lastName: 'Verveille',
          classe: '6°2',
          avatar: '/app/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg',
          active: false
        },
        { 
          id: 3,
          couleur: 'bleu',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 4,
          couleur: 'violet',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        {
          id: 5,
          couleur: 'bleu',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 6,
          couleur: 'violet',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 7,
          couleur: 'vert',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 8,
          couleur: 'jaune',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 9,
          couleur: 'vert',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 10,
          couleur: 'jaune',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 11,
          couleur: 'rouge',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 12,
          couleur: 'bleu',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 13,
          couleur: 'rouge',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 14,
          couleur: 'bleu',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 15,
          couleur: 'violet',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        },
        { 
          id: 16,
          couleur: 'vert',
          firstName: '',
          lastName: '',
          classe: '',
          avatar: '',
          active: false
        }
      ];

    
  }])
  .controller('CarnetsCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
    $scope.classe = $rootScope.classe;
    $scope.carnets = 
    [ 
      { 
        id: 2,
        couleur: 'rouge',
        firstName: 'Sophie',
        lastName: 'Delaville',
        classe: '5°3',
        avatar: '/app/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg'
      },
      { 
        id: 3,
        couleur: 'bleu',
        firstName: 'Cyril',
        lastName: 'Entelle',
        classe: '5°3',
        avatar: '/app/bower_components/charte-graphique-laclasse-com/images/avatar_masculin.svg'
      },
      { 
        id: 4,
        couleur: 'violet',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      {
        id: 5,
        couleur: 'bleu',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 6,
        couleur: 'violet',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 7,
        couleur: 'vert',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 8,
        couleur: 'jaune',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 9,
        couleur: 'vert',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 10,
        couleur: 'jaune',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 11,
        couleur: 'rouge',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 12,
        couleur: 'bleu',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 13,
        couleur: 'rouge',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 14,
        couleur: 'bleu',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 15,
        couleur: 'violet',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      },
      { 
        id: 16,
        couleur: 'vert',
        firstName: '',
        lastName: '',
        classe: '',
        avatar: ''
      } 
    ];
    $scope.return = function(){
      $location.url('/');
    }

    $scope.open = function(carnet){
      $location.url('/carnet/'+carnet.id);
    }
  }])
  .controller('AsideCarnetCtrl', ['$scope', '$rootScope', '$location', '$stateParams', function($scope, $rootScope, $location, $stateParams) {
    $scope.isopen = false;

    $scope.masterchk = "";
    $scope.chk1 = "";
    $scope.chk2 = "";
    $scope.chk3 = "";
    $scope.chk4 = "";
    $scope.chk5 = "";

    $scope.return = function(){
      $location.url('/');
    }

    $scope.rights = function(){
      $location.url('/carnet/rights/'+$stateParams.id);
    }

  }])
  .controller('CarnetCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
    $scope.entrees = 0;
    $scope.tabs = [
      {
        id: 0,
        name: "Maths",
        editable: false,
        active: true,
        htmlcontent: "",
        modifEntree: null,
        entrees: [
                    {
                      id: 0,
                      message: "je suis sophie",
                      date: Date.now()
                    }
                  ]
      },
      {
        id: 1,
        name: "Anglais",
        editable: false,
        active: false,
        htmlcontent: "",
        modifEntree: null,
        entrees: []
      }
    ];

    $scope.activeTab = function(tab){
      for (var i = 0; i < $scope.tabs.length; i++) {
        if ($scope.tabs[i].id == tab.id) {
          $scope.tabs[i].active = true;
        } else{
          $scope.tabs[i].active = false;
        };
      };
    };

    $scope.changeNameTab = function(tab){
      for (var i = 0; i < $scope.tabs.length; i++) {
        if ($scope.tabs[i].id == tab.id) {
          $scope.tabs[i].editable = !tab.editable;
        };
      };
    };

    $scope.addEntree = function(tabId){
      for (var i = 0; i < $scope.tabs.length; i++) {
        if ($scope.tabs[i].id == tabId) {
          if ($scope.tabs[i].htmlcontent.trim()=="") {return false;};
          if ( $scope.tabs[i].modifEntree != null){
            for (var j = 0; j < $scope.tabs[i].entrees.length; j++) {
              if ($scope.tabs[i].entrees[j].id == $scope.tabs[i].modifEntree) {
                $scope.tabs[i].entrees[j].message = $scope.tabs[i].htmlcontent;
                $scope.tabs[i].modifEntree = null;
              };
            };
          } else {
            var entree = {
              id: ++$scope.entrees,
              message: $scope.tabs[i].htmlcontent,
              date: Date.now()
            };
            $scope.tabs[i].entrees.push(entree);            
          }
          $scope.tabs[i].htmlcontent = "";
        };
      };
    };

    $scope.editEntree = function(tabId, entree){
      for (var i = 0; i < $scope.tabs.length; i++) {
        if ($scope.tabs[i].id == tabId) {
          $scope.tabs[i].htmlcontent = entree.message;
          $scope.tabs[i].modifEntree = entree.id;
        }
      }
    }

    $scope.addTab = function(){
      var newTab = {
        id: $scope.tabs.length,
        name: "Nouvel onglet",
        editable: true,
        active: true,
        htmlcontent: "",
        modifEntree: null,
        entrees: []
      };
      $scope.activeTab(newTab);
      $scope.tabs.push(newTab);
    };

    $scope.removeTab = function(tab){
      for (var i = 0; i < $scope.tabs.length; i++) {
        if ($scope.tabs[i].id == tab.id) {
          $scope.tabs.splice(i,1);
        }
      }
    };

    $scope.removedEntree = function(tabId, entree){
      for (var i = 0; i < $scope.tabs.length; i++) {
        if ($scope.tabs[i].id == tabId) {
          for (var j = 0; j < $scope.tabs[i].entrees.length; j++) {
            if ($scope.tabs[i].entrees[j].id == entree.id) {
              $scope.tabs[i].entrees.splice(j,1);
            };
          };
        };
      };
    };

  }])
  .controller('RightsCtrl', ['$scope', '$rootScope', '$location', '$stateParams', function($scope, $rootScope, $location, $stateParams) {

    $scope.rights = [
      {
        type: "ELEVE ET FAMILLE",
        background: "rgba(232,194,84,0.3)",
        text: "#e8c254",
        users: [
          {
            id:"VAA60001",
            fullname: "Sophie Delaville",
            profil: "élève",
            r: true,
            w: false
          },
          {
            id:"VAA60002",
            fullname: "Marc Delaville",
            profil: "parent",
            r: true,
            w: false
          },
          {
            id:"VAA60003",
            fullname: "Florence Delaville",
            profil: "parent",
            r: true,
            w: false
          }
        ]
      },
      {
        type: "COLLEGE",
        background: "rgba(26,161,204,0.3)",
        text: "#1aa1cc",
        users: [
          {
            id:"VAA60004",
            fullname: "Annie Chandon",
            profil: "prof",
            r: true,
            w: true
          },
          {
            id:"VAA60005",
            fullname: "Nathalie Bonjour",
            profil: "prof",
            r: true,
            w: true
          },
          {
            id:"VAA60006",
            fullname: "Jérôme Dumoulin",
            profil: "prof",
            r: true,
            w: false
          }
        ]
      }
    ];

    $scope.listUsersTypes=[
      {
        type: "Profs",
        open: true,
        users: [
          {
            id:"VAA60007",
            fullname: "Sonia Orange",
            profil: "prof",
            r: true,
            w: false
          },
          {
            id:"VAA60008",
            fullname: "Stéphanie Citron",
            profil: "prof",
            r: true,
            w: false
          },
          {
            id:"VAA60009",
            fullname: "Maxime Chocolat",
            profil: "prof",
            r: true,
            w: false
          }
        ]
      },
      {
        type: "Autres",
        open: false,
        users: [
          {
            id:"VAA60010",
            fullname: "Thomas Vert",
            profil: "Psycologue",
            r: true,
            w: false
          },
          {
            id:"VAA60011",
            fullname: "Noé Pourpre",
            profil: "documentaliste",
            r: true,
            w: false
          }
        ]
      },
      {
        type: "CPE",
        open: false,
        users: [
          {
            id:"VAA60012",
            fullname: "Stéphane Marron",
            profil: "cpe",
            r: true,
            w: false
          },
          {
            id:"VAA60013",
            fullname: "Corinne Bleuet",
            profil: "cpe",
            r: true,
            w: false
          },
          {
            id:"VAA60014",
            fullname: "Sandrine Mauve",
            profil: "cpe",
            r: true,
            w: false
          },
          {
            id:"VAA60015",
            fullname: "Eric Grenat",
            profil: "cpe",
            r: true,
            w: false
          },
          {
            id:"VAA60016",
            fullname: "Dominique Blanchet",
            profil: "cpe",
            r: true,
            w: false
          }
        ]
      }
    ];

    $scope.addUser=function(type, user){
      for (var i = 0; i < $scope.listUsersTypes.length; i++) {
        if($scope.listUsersTypes[i].type == type){
          for (var j = 0; j < $scope.listUsersTypes[i].users.length; j++) {
            if($scope.listUsersTypes[i].users[j].id == user.id){
              if(user.profil == "parent" || user.profil == "élève"){
                $scope.rights[0].users.push(user);
              } else {
                $scope.rights[1].users.push(user);
              };
              $scope.listUsersTypes[i].users.splice(j,1);
            };
          };
        };
      };
    };

    $scope.delUser=function(user){
      for (var i = 0; i < $scope.rights.length; i++) {
        for (var j = 0; j < $scope.rights[i].users.length; j++) {
          if($scope.rights[i].users[j].id == user.id){
            switch(user.profil) {
              case "prof":
                  $scope.listUsersTypes[0].users.push(user);
                  break;
              case "cpe":
                  $scope.listUsersTypes[2].users.push(user);
                  break;
              default:
                  $scope.listUsersTypes[1].users.push(user);
            };
            $scope.rights[i].users.splice(j,1);
          };
        };
      };
    };

    $scope.save = function(){
      // enregistrer en base
      $location.url('/carnet/'+$stateParams.id);
    }

    $scope.cancel = function(){
      $location.url('/carnet/'+$stateParams.id);
    }
  }]);

  
function RootCtrl($scope, currentUser, $rootScope, APPLICATION_PREFIX_URL, BASE_SERVICE_URL, SERVICE_ANNUAIRE, FlashServiceStyled, $http, User, Svg, EVIGNAL){

  $rootScope.classe = {};

  $rootScope.carnets = {};

  // $rootScope.racine_images = '/bower_components/charte-graphique-laclasse-com/images/';

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
  $rootScope.app_prefix = APPLICATION_PREFIX_URL;
  //initialisation de l'utilisateur.
  $rootScope.initCurrentUser = function(){
    User.init(BASE_SERVICE_URL, SERVICE_ANNUAIRE+'/user/session');
    currentUser.set_current_user($rootScope.current_user);
  }
  // Svg.modifyFill("logolaclasse", "white");
};
RootCtrl.$inject=['$scope', 'currentUser', '$rootScope', 'APPLICATION_PREFIX_URL', 'BASE_SERVICE_URL', 'SERVICE_ANNUAIRE', 'FlashServiceStyled', '$http', 'User', 'Svg', 'EVIGNAL'];
