'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('RightsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', function($scope, $rootScope, $state, $stateParams) {

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
    $state.go( 'suivi.carnet', $state.params, { reload: true, inherit: true, notify: true } );
  }

  $scope.cancel = function(){
    $state.go( 'suivi.carnet', $state.params, { reload: true, inherit: true, notify: true } );
  }
}]);