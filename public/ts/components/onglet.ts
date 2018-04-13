angular.module('suiviApp')
  .config(['$compileProvider',
    function($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|blob|data):/);
    }])
  .component('onglet',
  {
    bindings: {
      uids: '<',
      onglets: '<',
      onglet: '='
    },
    controller: ['$uibModal', '$state', '$q', '$window', '$sce', '$location', 'Saisies',
      function($uibModal, $state, $q, $window, $sce, $location, Saisies) {
        let ctrl = this;

        ctrl.order_by = {
          field: 'date',
          reverse: true
        };

        ctrl.callback_popup_onglet = function(onglet) {
          if (onglet.action == 'deleted') {
            $state.go('student',
                      { uids: ctrl.uids },
              { reload: true });
          }
        };

        ctrl.saisie_callback = function(saisie) {
          switch (saisie.action) {
            case 'created':
              ctrl.saisies.push(saisie);
              init_new_saisie();
              break;
            case 'deleted':
              ctrl.saisies = ctrl.saisies.filter(function(s) { return s.id != saisie.id; });
              break;
            case 'updated':
              let index = ctrl.saisies.findIndex(function(s) { return s.id == saisie.id; })
              ctrl.saisies[index] = saisie;
              break;
            default:
              console.log('What to do with this?')
              console.log(saisie)
          }
        };

        let init_new_saisie = function() {
          ctrl.new_saisie = ctrl.onglet.writable ? { create_me: true } : null;
        };

        let filter_on_pin = function(pinned) {
          return function() {
            return function(saisie) {
              return saisie.pinned == pinned;
            }
          }
        }
        ctrl.filter_pinned = filter_on_pin(true);
        ctrl.filter_unpinned = filter_on_pin(false);

        ctrl.$onInit = function() {
          init_new_saisie();

          Saisies.query({
            "onglets_ids[]": ctrl.onglet.ids
          }).$promise
            .then(function success(response) {
              ctrl.saisies = response;
            },
            function error(response) { });
        };
      }],
    template: `
                  <saisie class="col-md-12" style="display: inline-block;"
                          ng:repeat="saisie in $ctrl.saisies | filter:$ctrl.filter_pinned() | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse"
                          onglet="$ctrl.onglet"
                          saisie="saisie"
                          callback="$ctrl.saisie_callback( saisie )"></saisie>

                  <saisie class="col-md-12"
                          style="display: inline-block;"
                          ng:if="$ctrl.new_saisie"
                          onglet="$ctrl.onglet"
                          saisie="$ctrl.new_saisie"
                          callback="$ctrl.saisie_callback( $ctrl.new_saisie )"></saisie>

                  <div class="col-md-12" style="margin-bottom: 10px;">
                    <button class="btn btn-sm btn-primary pull-right"
                            ng:click="$ctrl.order_by.reverse = !$ctrl.order_by.reverse"
                            ng:if="$ctrl.saisies.length > 1">
                      <span class="glyphicon"
                            ng:class="{'glyphicon-sort-by-order': $ctrl.order_by.reverse, 'glyphicon-sort-by-order-alt': !$ctrl.order_by.reverse}"></span>
                      Trier par la date de publication la plus <span ng:if="$ctrl.order_by.reverse">récente</span><span ng:if="!$ctrl.order_by.reverse">ancienne</span>.
                    </button>
                  </div>

                  <div class="col-md-12 saisies" style="overflow-y: auto;">

                    <saisie class="col-md-12" style="display: inline-block;"
                            ng:repeat="saisie in $ctrl.saisies | filter:$ctrl.filter_unpinned() | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse"
                            onglet="$ctrl.onglet"
                            saisie="saisie"
                            callback="$ctrl.saisie_callback( saisie )"></saisie>
                  </div>
`
  });
