angular.module('suiviApp')
  .component('onglets',
  {
    bindings: {
      uids: '<'
    },
    controller: ['$uibModal', 'Onglets', 'Popups', 'APIs',
      function($uibModal, Onglets, Popups, APIs) {
        let ctrl = this;
        ctrl.popup_onglet = Popups.onglet;

        ctrl.callback_popup_onglet = function(onglet) {
          if (onglet.created) {
            ctrl.onglets.push(onglet);
          }
        };

        ctrl.$onInit = function() {
          if (ctrl.uids.length == 1) {
            Onglets.query({ "uids[]": ctrl.uids }).$promise
              .then(function success(response) {
                ctrl.onglets = _(response[0]).map(function(onglet) {
                  onglet.ids = [onglet.id];
                  return onglet;
                });
              },
              function error(response) { });
          } else {
            APIs.query_common_onglets_of(ctrl.uids)
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
                ng:click="$ctrl.popup_onglet( $ctrl.uids, onglet, $ctrl.onglets, $ctrl.callback_popup_onglet )">
          <span class="glyphicon glyphicon-cog"></span>
        </button>
      </uib-tab-heading>

      <onglet uids="$ctrl.uids"
              onglets="$ctrl.onglets"
              onglet="onglet">
      </onglet>
    </uib-tab>

    <li>
      <a href
         class="bleu add-onglet"
         ng:click="$ctrl.popup_onglet( $ctrl.uids, null, $ctrl.onglets, $ctrl.callback_popup_onglet )">
        <span class="glyphicon glyphicon-plus">
        </span>
      </a>
    </li>
  </uib-tabset>
`
  });
