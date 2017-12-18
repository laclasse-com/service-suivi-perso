angular.module('suiviApp')
  .service('Popups',
  ['$uibModal', '$q', 'Onglets', 'Droits', 'Saisies', 'APIs', 'UID',
    function($uibModal, $q, Onglets, Droits, Saisies, APIs, UID) {
      let service = this;

      let template_onglet = `
<div class="modal-header">
<h3 class="modal-title">
Propriétés de l'onglet
</h3>
</div>

<div class="modal-body">
<label>Titre : <input type="text" maxlength="45" ng:model="$ctrl.onglet.nom" ng:maxlength="45" ng:change="$ctrl.onglet.dirty = true; $ctrl.name_validation()" />
<span class="label label-danger" ng:if="!$ctrl.valid_name">Un onglet existant porte déjà ce nom !</span>
</label>

<span class="label label-info" ng:if="$ctrl.uids">L'élève aura un accès en lecture/écriture à cet onglet.</span>
<droits uid-eleve="$ctrl.uid_eleve"
droits="$ctrl.droits"
concerned-people="$ctrl.concerned_people"
ng:if="$ctrl.droits"></droits>

<div class="clearfix"></div>
</div>

<div class="modal-footer">
<button class="btn btn-danger pull-left"
ng:click="$ctrl.delete()"
ng:if="$ctrl.onglet.id">
<span class="glyphicon glyphicon-trash"></span>
<span> Supprimer l'onglet</span>
</button>
<button class="btn btn-default"
ng:click="$ctrl.cancel()">
<span class="glyphicon glyphicon-remove-sign"></span>
<span ng:if="$ctrl.onglet.nom"> Annuler</span>
<span ng:if="!$ctrl.onglet.nom"> Fermer</span>
</button>
<button class="btn btn-success"
ng:click="$ctrl.ok()"
ng:disabled="!$ctrl.onglet.nom || !$ctrl.valid_name">
<span class="glyphicon glyphicon-ok-sign"></span> Valider
</button>
</div>
`;

      service.onglet = function(uid_eleve, onglet, all_onglets, callback) {
        $uibModal.open({
          resolve: {
            uid_eleve: function() { return uid_eleve; },
            onglet: function() { return _(onglet).isNull() ? { nom: '' } : onglet; },
            all_onglets: function() { return all_onglets; }
          },
          controller: ['$scope', '$uibModalInstance', '$q', 'Droits', 'APIs', 'URL_ENT', 'DEFAULT_RIGHTS_ONGLET', 'UID', 'uid_eleve', 'onglet', 'all_onglets',
            function PopupOngletCtrl($scope, $uibModalInstance, $q, Droits, APIs, URL_ENT, DEFAULT_RIGHTS_ONGLET, UID, uid_eleve, onglet, all_onglets) {
              let ctrl = $scope;
              ctrl.$ctrl = ctrl;

              ctrl.uid_eleve = uid_eleve;
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
                ctrl.droits.push(new Droits({ uid: uid_eleve, read: true, write: true, manage: false }));
                ctrl.droits = ctrl.droits.concat(_(DEFAULT_RIGHTS_ONGLET)
                  .map(function(droit) {
                    let proper_droit = new Droits(droit);

                    proper_droit.dirty = { profil_id: true, read: true, write: true, manage: true };

                    return proper_droit;
                  }));
              }

              APIs.get_user(uid_eleve)
                .then(function success(response) {
                  ctrl.eleve = response.data;
                },
                function error(response) { });

              APIs.query_people_concerned_about(uid_eleve)
                .then(function success(response) {
                  ctrl.concerned_people = response;
                },
                function error(response) { });

              ctrl.name_validation = function() {
                let other_onglets_names = _.chain(ctrl.all_onglets)
                  .reject(function(onglet) {
                    return !_(ctrl.onglet).isNull() && ctrl.onglet.id == onglet.id;
                  })
                  .pluck('nom')
                  .value();

                ctrl.valid_name = !_(other_onglets_names).includes(ctrl.onglet.nom);

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
                    ctrl.onglet.delete = true;
                    ctrl.ok();
                  });
              };

              ctrl.cancel = function() {
                $uibModalInstance.dismiss();
              };
            }],
          template: template_onglet
        })
          .result.then(function success(response_popup) {
            let promise = null;
            let action = 'rien';

            if (_(onglet).isNull()) {
              action = 'created';

              promise = new Onglets({
                uid: uid_eleve,
                nom: response_popup.onglet.nom
              }).$save();
            } else {
              if (response_popup.onglet.delete) {
                action = 'deleted';

                promise = new Onglets(response_popup.onglet).$delete();
              } else if (response_popup.onglet.dirty) {
                promise = new Onglets(response_popup.onglet).$update();
              } else {
                promise = $q.resolve(response_popup.onglet);
              }
            }

            promise.then(function success(response) {
              response.action = action;

              if (action != 'deleted') {
                _.chain(response_popup.droits)
                  .reject(function(droit) {
                    return action == 'created' && _(droit).has('uid') && (droit.uid == UID || droit.uid == uid_eleve);
                  })
                  .each(function(droit) {
                    if (droit.to_delete) {
                      if (_(droit).has('id')) {
                        droit.$delete();
                      }
                    } else if (droit.dirty
                      && (droit.uid !== '...' && droit.profil_id !== '...' && droit.sharable_id !== '...')
                      && _(droit.dirty).reduce(function(memo, value) { return memo || value; }, false)
                      && droit.read) {
                      droit.onglet_id = response.id;

                      (_(droit).has('id') ? droit.$update() : droit.$save());
                    }
                  });
              }

              callback(response);
            },
              function error() { });
          }, function error() { });
      };

      service.batch = (uids, callback) => {
        $uibModal.open({
          resolve: {
            uids: function() { return uids; }
          },
          controller: ['$scope', '$uibModalInstance', 'uids',
            function($scope, $uibModalInstance, uids) {
              let ctrl = $scope;
              ctrl.$ctrl = ctrl;

              ctrl.uids = uids;
            }],
          template: `
<div class="modal-header">
  <h3 class="modal-title">
    Onglet(s) commun(s)
  </h3>
</div>

<div class="modal-body">
  <onglets uids-eleves="$ctrl.uids"></onglets>
  <div class="clearfix"></div>
</div>`
        });
      };

      service.onglet_batch = function(uids, callback) {
        $uibModal.open({
          resolve: {
            uids: function() { return uids; }
          },
          controller: ['$scope', '$uibModalInstance', '$q', 'Droits', 'APIs', 'URL_ENT', 'DEFAULT_RIGHTS_ONGLET', 'UID', 'uids',
            function PopupOngletCtrl($scope, $uibModalInstance, $q, Droits, APIs, URL_ENT, DEFAULT_RIGHTS_ONGLET, UID, uids) {
              let ctrl = $scope;
              ctrl.$ctrl = ctrl;
              ctrl.uids = uids;
              ctrl.droits = [{ uid: UID, read: true, write: true, manage: true }];
              ctrl.droits = ctrl.droits.concat(_(DEFAULT_RIGHTS_ONGLET)
                .map(function(droit) {
                  let proper_droit = new Droits(droit);

                  proper_droit.dirty = { profil_id: true, read: true, write: true, manage: true };

                  return proper_droit;
                }));

              APIs.query_common_onglets_of(ctrl.uids)
                .then(function(response) {
                  ctrl.common_tabs = response;
                });

              let current_user = null;
              let profils = {};
              let personnels: Array<any> = new Array<any>();
              APIs.get_current_user()
                .then(function success(response) {
                  current_user = response;

                  return APIs.query_profiles_types();
                })
                .then(function success(response) {
                  profils = _(response.data).indexBy('id');

                  return APIs.get_structure(current_user.profil_actif.structure_id);
                },
                function error(response) { return $q.reject(response); })
                .then(function success(response) {
                  if (_(response).has('data')) {
                    personnels = _(response.data.profiles)
                      .reject(function(user) {
                        return _(['ELV', 'TUT']).contains(user.type);
                      });

                    return APIs.get_users(_(personnels).pluck('user_id'));
                  }
                },
                function error(response) { return $q.reject(response); })
                .then(function success(response) {
                  if (_(response).has('data')) {
                    personnels = _(personnels).indexBy('user_id') as Array<any>;

                    ctrl.concerned_people = _(response.data).map(function(people) {
                      people.type = profils[personnels[people.id].type].name;

                      return people;
                    });
                  }
                },
                function error(response) { return $q.reject(response); });

              ctrl.valid_name = true;

              ctrl.name_validation = function() {
                let other_onglets_names = _(ctrl.common_tabs).keys();

                ctrl.valid_name = !_(other_onglets_names).includes(ctrl.onglet.nom);

                return ctrl.valid_name;
              };

              ctrl.ok = function() {
                $uibModalInstance.close({
                  onglet: ctrl.onglet,
                  droits: ctrl.droits
                });
              };

              ctrl.cancel = function() {
                $uibModalInstance.dismiss();
              };
            }],
          template: template_onglet
        })
          .result.then(function success(response_popup) {
            let promises = null;
            let action = 'created';

            new Onglets({
              uids: uids,
              nom: response_popup.onglet.nom
            }).$save()
              .then(function success(response) {
                response.action = action;

                let onglets_ids = _(response.data).pluck('id');
                _.chain(response_popup.droits)
                  .reject(function(droit) { return _(droit).has('uid') && droit.uid == UID; })
                  .reject(function(droit) { return _(droit).has('to_delete') && droit.to_delete; })
                  .each(function(droit) {
                    droit.onglets_ids = onglets_ids;

                    new Droits(droit).$save();
                  });

                callback(response);
              },
              function error(response) { console.log(response) });
          }, function error() { });
      };

      service.publish_batch = function(uids) {
        $uibModal.open({
      template: `
      <div class="modal-header">
        <h3 class="modal-title">
          Publication simultanée vers un onglet commun à plusieurs élèves
        </h3>
      </div>

      <div class="modal-body">
        <div class="alert alert-warning" role="alert" ng:if="$ctrl.common_tabs && !$ctrl.has_common_tabs">Aucun onglet commun n'a été trouvé pour cette sélection d'élèves.</div>

        <div ng:if="$ctrl.common_tabs && $ctrl.has_common_tabs">
          <label>Onglet(s) commun(s) existant(s) :</label>
          <div class="btn-group">
            <label class="btn btn-primary" ng-model="$ctrl.selected_onglets" uib-btn-radio="tabs"ng:repeat="(name, tabs) in $ctrl.common_tabs">{{name}}</label>
          </div>
        </div>

        <saisie class="col-md-12"
                style="display: inline-block;"
                passive="true"
                saisie="$ctrl.saisie"
                onglets="$ctrl.selected_onglets"
                ng:if="$ctrl.common_tabs && $ctrl.has_common_tabs"></saisie>

        <div class="clearfix"></div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-default"
                ng:click="$ctrl.close()">
          <span class="glyphicon glyphicon-remove-sign"></span> Fermer
        </button>
      </div>
`,
          resolve: {
            uids: function() { return uids; }
          },
          controller: ['$scope', '$uibModalInstance', '$q', 'Saisies', 'APIs', 'uids',
            function PopupOngletCtrl($scope, $uibModalInstance, $q, Saisies, APIs, uids) {
              let ctrl = $scope;
              ctrl.$ctrl = ctrl;

              ctrl.uids = uids;

              ctrl.saisie = { create_me: true };

              APIs.query_common_onglets_of(ctrl.uids)
                .then(function(response) {
                  ctrl.common_tabs = response;
                  ctrl.has_common_tabs = !_(ctrl.common_tabs).isEmpty();
                });

              ctrl.close = function() {
                $uibModalInstance.dismiss();
              };
            }]
        });
      };
    }]);
