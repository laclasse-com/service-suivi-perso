'use strict';

angular.module('suiviApp')
  .component('onglet',
  {
    bindings: {
      uidEleve: '<',
      onglets: '<',
      onglet: '='
    },
    controller: ['$uibModal', '$state', '$q', 'Saisies', 'Popups',
      function($uibModal, $state, $q, Saisies, Popups) {
        let ctrl = this;

        ctrl.manage_onglet = Popups.onglet;

        ctrl.order_by = {
          field: 'date',
          reverse: true
        };

        ctrl.callback_popup_onglet = function(onglet) {
          if (onglet.action == 'deleted') {
            $state.go('carnet',
              { uid_eleve: ctrl.uidEleve },
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
              ctrl.saisies = _(ctrl.saisies).reject(function(s) { return s.id === saisie.id; });
              break;
            case 'updated':
              let index = _(ctrl.saisies).findIndex(function(s) { return s.id == saisie.id; })
              ctrl.saisies[index] = saisie;

              console.log(ctrl.saisies)
              console.log(saisie)
              break;
            default:
              console.log('What to do with this?')
              console.log(saisie)
          }

          update_pin_status();
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

        let update_pin_status = function() {
          ctrl.onglet.has_pin = _(ctrl.saisies).findIndex(function(saisie) { return saisie.pinned; }) != -1;
        };

        ctrl.$onInit = function() {
          init_new_saisie();

          Saisies.query({
            onglet_id: ctrl.onglet.id
          }).$promise
            .then(function success(response) {
              ctrl.saisies = response;
              update_pin_status();
            },
            function error(response) { });
        };
      }],
    template: `
<span class="hidden-xs hidden-sm floating-button toggle big off jaune"
                        ng:if="$ctrl.onglet.manageable"
                        ng:click="$ctrl.manage_onglet( $ctrl.uidEleve, $ctrl.onglet, $ctrl.onglets, $ctrl.callback_popup_onglet )"></span>


                  <div class="col-md-12 saisies" style="overflow-y: auto;">

                    <saisie class="col-md-12" style="display: inline-block;"
                            ng:repeat="saisie in $ctrl.saisies | filter:$ctrl.filter_pinned() | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse"
                            onglet="$ctrl.onglet"
                            saisie="saisie"
                            callback="$ctrl.saisie_callback( saisie )"></saisie>
                  </div>

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
