angular.module('suiviApp')
  .service('Popups',
    ['$uibModal', '$q', 'Onglets', 'Droits', 'Saisies', 'APIs', 'UID', 'User',
      function($uibModal, $q, Onglets, Droits, Saisies, APIs, UID, User) {
        let Popups = this;

        Popups.loading_window = function(title, text, action) {
          return swal({
            title: title,
            text: text,
            type: "info",
            showLoaderOnConfirm: true,
            onOpen: function() {
              return swal.clickConfirm();
            },
            preConfirm: function() {
              return new Promise(function(resolve) {
                action()
                  .then(function success(response) {
                    swal.closeModal();
                  },
                    function error(response) {
                      console.log(response);
                      swal.closeModal();
                      swal({
                        title: 'Erreur :(',
                        text: response.data.error,
                        type: 'error'
                      });

                    }
                  );
              });
            },
            allowOutsideClick: false
          });
        };

        Popups.onglet = function(uids, onglet, all_onglets, callback) {
          $uibModal.open({
template: `
<div class="modal-header">
  <h3 class="modal-title">
    Propriétés de l'onglet
  </h3>
</div>

<div class="modal-body">
<label>Titre : <input type="text" maxlength="45" ng:model="$ctrl.onglet.name" ng:maxlength="45" ng:change="$ctrl.onglet.dirty = true; $ctrl.name_validation()" />
<span class="label label-danger" ng:if="!$ctrl.valid_name">Un onglet existant porte déjà ce nom !</span>
</label>

<span class="label label-info" ng:if="$ctrl.uids">L'élève aura un accès en lecture/écriture à cet onglet.</span>
<droits uid-eleve="$ctrl.uids"
droits="$ctrl.droits"
concerned-people="$ctrl.concerned_people"
ng:if="$ctrl.droits"></droits>

<div class="clearfix"></div>
</div>

<div class="modal-footer">
<button class="btn btn-danger pull-left"
ng:click="$ctrl.delete()"
ng:if="$ctrl.onglet.id || $ctrl.onglet.ids">
<span class="glyphicon glyphicon-trash"></span>
<span> Supprimer l'onglet</span>
</button>
<button class="btn btn-default"
          ng:click="$ctrl.cancel()">
    <span class="glyphicon glyphicon-remove-sign"></span>
<span ng:if="$ctrl.onglet.name"> Annuler</span>
<span ng:if="!$ctrl.onglet.name"> Fermer</span>
</button>
<button class="btn btn-success"
          ng:click="$ctrl.ok()"
ng:disabled="!$ctrl.onglet.name || !$ctrl.valid_name">
<span class="glyphicon glyphicon-ok-sign"></span> Valider
  </button>
</div>
`,
            resolve: {
              uids: function() { return uids; },
              onglet: function() { return _(onglet).isNull() ? { name: '' } : onglet; },
              all_onglets: function() { return all_onglets; }
            },
            controller: ['$scope', '$uibModalInstance', '$q', 'Droits', 'APIs', 'URL_ENT', 'DEFAULT_RIGHTS_ONGLET', 'UID', 'uids', 'onglet', 'all_onglets',
              function PopupOngletCtrl($scope, $uibModalInstance, $q, Droits, APIs, URL_ENT, DEFAULT_RIGHTS_ONGLET, UID, uids, onglet, all_onglets) {
                let ctrl = $scope;
                ctrl.$ctrl = ctrl;

                ctrl.uids = uids;
                ctrl.onglet = onglet;
                ctrl.all_onglets = all_onglets;
                ctrl.onglet.delete = false;
                ctrl.valid_name = true;

                if (_(ctrl.onglet).has('id')) {
                  Droits.query({
                    onglet_id: ctrl.onglet.id
                  }).$promise
                    .then(function success(response) {
                      ctrl.droits = _(response).map(function(droit) {
                        return new Droits(droit);
                      });
                    },
                      function error(response) { });
                } else {
                  ctrl.droits = [new Droits({ uid: UID, read: true, write: true, manage: true })];
                  ctrl.droits.push(new Droits({ uid: uids, read: true, write: true, manage: false }));
                  ctrl.droits = ctrl.droits.concat(_(DEFAULT_RIGHTS_ONGLET)
                    .map(function(droit) {
                      let proper_droit = new Droits(droit);

                      proper_droit.dirty = { profile_type: true, read: true, write: true, manage: true };

                      return proper_droit;
                    }));
                }

                if (uids.length == 1) {
                  User.get({ id: uids[0] }).$promise
                    .then(function success(response) {
                      ctrl.eleve = response;

                      ctrl.eleve.query_people_concerned_about(uids[0])
                        .then(function success(response) {
                          ctrl.concerned_people = response;
                        },
                          function error(response) { });
                    },
                      function error(response) { });
                } else {
                  User.get({ id: UID }).$promise
                    .then(function success(response) {
                      ctrl.concerned_people = [response];

                      return APIs.get_users(uids);
                    },
                      function error(response) { })
                    .then(function success(response) {
                      ctrl.concerned_people = ctrl.concerned_people.concat(response.data);
                    },
                      function error(response) { });
                }

                ctrl.name_validation = function() {
                  let other_onglets_names = _.chain(ctrl.all_onglets)
                    .reject(function(onglet) {
                      return !_(ctrl.onglet).isNull() && ctrl.onglet.id == onglet.id;
                    })
                    .pluck('name')
                    .value();

                  ctrl.valid_name = !_(other_onglets_names).includes(ctrl.onglet.name);

                  return ctrl.valid_name;
                };

                ctrl.ok = function() {
                  $uibModalInstance.close({
                    onglet: ctrl.onglet,
                    droits: ctrl.droits
                  });
                };

                ctrl.delete = function() {
                  swal({
                    title: 'Êtes-vous sur ?',
                    text: "L'onglet ainsi que toutes les saisies et droits associés seront définitivement supprimés !",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Oui, je confirme !',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Annuler'
                  })
                    .then((result) => {
                      ctrl.onglet.delete = result.dismiss != "cancel";
                      ctrl.ok();
                    });
                };

                ctrl.cancel = function() {
                  $uibModalInstance.dismiss();
                };
              }]
          })
            .result.then(function success(response_popup) {
              let promise = null;
              let action = 'rien';

              if (_(onglet).isNull()) {
                action = 'created';

                // Popups.loading_window(
                //   "Création de l'onglet",
                //   "",
                //   function() {
                promise = Onglets.save({
                  uids: uids,
                  name: response_popup.onglet.name
                }).$promise;

                //     return $q.resolve(true);
                //   }
                // );
              } else {
                if (response_popup.onglet.delete) {
                  action = 'deleted';

                  response_popup.onglet["ids[]"] = response_popup.onglet.ids;
                  delete response_popup.onglet.ids;

                  promise = Onglets.delete(response_popup.onglet).$promise;
                } else if (response_popup.onglet.dirty) {
                  promise = Onglets.update(response_popup.onglet).$promise;
                } else {
                  promise = $q.resolve(response_popup.onglet);
                }
              }

              promise.then(function success(response) {
                if (response.id != undefined) {
                  response = [response];
                }

                let onglets_ids = response.map((onglet) => { return onglet.id; });

                response.action = action;

                if (action != 'deleted') {
                  _.chain(response_popup.droits)
                    .reject(function(droit) {
                      return action == 'created' && _(droit).has('uid') && (droit.uid == UID || droit.uid == uids);
                    })
                    .each(function(droit) {
                      if (droit.to_delete) {
                        if (_(droit).has('id')) {
                          Droits.delete(droit);
                        }
                      } else if (droit.dirty
                        && (droit.uid !== '...' && droit.profile_type !== '...' && droit.sharable_id !== '...')
                        && _(droit.dirty).reduce(function(memo, value) { return memo || value; }, false)
                        && droit.read) {
                        droit.onglets_ids = onglets_ids;

                        _(droit).has('id') ? Droits.update(droit) : Droits.save(droit);
                      }
                    });
                }

                callback(response);
              },
                function error() { });
            }, function error() { });
        };
      }]);
