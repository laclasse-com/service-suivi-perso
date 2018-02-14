angular.module('suiviApp')
  .component('onglets',
    {
      bindings: {
        uids: '<'
      },
      controller: ['$uibModal', 'Onglets', 'Popups', 'APIs', 'User',
        function($uibModal, Onglets, Popups, APIs, User) {
          let ctrl = this;
          ctrl.popup_onglet = Popups.onglet;

          ctrl.callback_popup_onglet = function(onglets) {
            if (onglets[0].created) {
              let new_onglet = onglets[0];
              new_onglet.ids = onglets.map((onglet) => { return onglet.id; });

              ctrl.onglets.push(new_onglet);
            }

            if (onglets[0].deleted) {
              ctrl.onglets = ctrl.onglets.filter(onglet => onglet.nom != onglets[0].nom);
            }
          };

          ctrl.$onInit = function() {
            if (ctrl.uids.length == 1) {
              Popups.loading_window(
                "Chargement des onglets",
                "",
                function() {
                  return Onglets.query({ "uids[]": ctrl.uids }).$promise
                    .then(function success(response) {
                      ctrl.onglets = _(response[0]).map(function(onglet) {
                        onglet.ids = [onglet.id];
                        return onglet;
                      });
                    },
                      function error(response) { });
                }
              );
            } else {
              Popups.loading_window(
                "Chargement des onglets communs",
                "",
                function() {
                  return APIs.query_common_onglets_of(ctrl.uids)
                    .then(function(response) {
                      ctrl.onglets = Object.keys(response).map((key) => {
                        return {
                          nom: key,
                          ids: response[key].map((onglet) => { return onglet.id; }),
                          writable: response[key].reduce((memo, onglet) => { return memo && onglet.writable; }, true),
                          manageable: response[key].reduce((memo, onglet) => { return memo && onglet.manageable; }, true)
                        };
                      });
                    })
                }
              );
            }

            User.get().$promise
              .then(function(response) {
                ctrl.current_user = response;

                ctrl.can_add_tab = ctrl.current_user.can_add_tab(ctrl.uids);
              });
          };
        }],
  template: `
  <style>
    .manage-onglet { margin-top: -11px; margin-right: -16px; border-radius: 0 0 0 12px; }
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
         ng:click="$ctrl.popup_onglet( $ctrl.uids, null, $ctrl.onglets, $ctrl.callback_popup_onglet )"
         ng:if="$ctrl.can_add_tab">
        <span class="glyphicon glyphicon-plus">
        </span>
      </a>
    </li>
  </uib-tabset>
`
    });
