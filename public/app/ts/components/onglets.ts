angular.module('suiviApp')
  .component('onglets',
  {
    bindings: {
      uidEleve: '<',
      uidsEleves: '<'
    },
    controller: ['$uibModal', 'Carnets', 'Onglets', 'Popups', 'APIs',
      function($uibModal, Carnets, Onglets, Popups, APIs) {
        let ctrl = this;
        ctrl.popup_onglet = Popups.onglet;

        ctrl.callback_popup_onglet = function(onglet) {
          if (onglet.created) {
            ctrl.onglets.push(onglet);
          }
        };

        ctrl.$onInit = function() {
          console.log(ctrl)
          if (ctrl.uidEleve != undefined) {
            Carnets.get({ uid_eleve: ctrl.uidEleve }).$promise
              .then(function success(response) {
                ctrl.carnet = response;

                Onglets.query({ uid: ctrl.uidEleve }).$promise
                  .then(function success(response) {
                    ctrl.onglets = response;
                  },
                  function error(response) { });
              },
              function error(response) { });
          } else if (ctrl.uidsEleves != undefined) {
            APIs.query_common_onglets_of(ctrl.uidsEleves)
              .then(function(response) {
                ctrl.onglets = Object.keys(response).map((key) => {
                  return {
                    nom: key,
                    ids: response[key].map((onglet) => { return onglet.id; }),
                    writable: response[key].reduce((memo, onglet) => { return memo && onglet.writable; }, true),
                    manageable: response[key].reduce((memo, onglet) => { return memo && onglet.manageable; }, true)
                  };
                });
              });
          }
        };
      }],
    template: `
  <style>
    .manage-onglet { margin-top: -20px; margin-right: -16px; border-radius: 0 0 0 12px; }
  </style>
  <uib-tabset>
    <uib-tab ng:repeat="onglet in $ctrl.onglets">
      <uib-tab-heading> {{onglet.nom}}
        <button class="btn btn-warning manage-onglet"
                ng:if="onglet.manageable"
                ng:click="$ctrl.popup_onglet( ($ctrl.uidEleve != undefined) ? [$ctrl.uidEleve] : $ctrl.uidsEleves, onglet, $ctrl.onglets, $ctrl.callback_popup_onglet )">
          <span class="glyphicon glyphicon-cog"></span>
        </button>
      </uib-tab-heading>

      <onglet uid-eleve="$ctrl.uidEleve"
              uids-eleves="$ctrl.uidsEleves"
              onglets="$ctrl.onglets"
              onglet="onglet">
      </onglet>
    </uib-tab>

    <li>
      <a href
         class="bleu add-onglet"
         ng:click="$ctrl.popup_onglet( ($ctrl.uidEleve != undefined) ? [$ctrl.uidEleve] : $ctrl.uidsEleves, null, $ctrl.onglets, $ctrl.callback_popup_onglet )">
        <span class="glyphicon glyphicon-plus">
        </span>
      </a>
    </li>
  </uib-tabset>
`
  });
