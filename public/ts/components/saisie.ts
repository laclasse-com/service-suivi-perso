angular.module('suiviApp')
  .component('saisie',
    {
      bindings: {
        onglet: '<',
        saisie: '=',
        callback: '&'
      },
      controller: ['$sce', 'Saisies', 'APIs', 'User', 'UID',
        function($sce, Saisies, APIs, User, UID) {
          let ctrl = this;

          ctrl.toggle_edit = function() {
            ctrl.edition = !ctrl.edition;

            if (!ctrl.edition) {
              ctrl.saisie.trusted_content = $sce.trustAsHtml(ctrl.saisie.content);
            } else {
              ctrl.previous_content = ctrl.saisie.content;
            }
          };

          ctrl.cancel = function() {
            ctrl.saisie.content = ctrl.previous_content;

            ctrl.toggle_edit();
          };

          ctrl.save = function() {
            ctrl.saisie.pinned = ctrl.saisie.tmp_pinned || false;
            if (!_(ctrl.saisie).has('$save')) {
              ctrl.saisie.onglets_ids = ctrl.onglet.ids;

              ctrl.saisie = new Saisies(ctrl.saisie);
            }
            let promise = ctrl.new_saisie ? ctrl.saisie.$save() : ctrl.saisie.$update();

            promise.then(function success(response) {
              if (!ctrl.new_saisie) {
                ctrl.toggle_edit();
              }
              ctrl.saisie.action = ctrl.new_saisie ? 'created' : 'updated';
              ctrl.callback();
            },
              function error(response) { console.log(response) });
          };

          ctrl.delete = function() {
            swal({
              title: 'Êtes-vous sur ?',
              text: "La saisie sera définitivement supprimée !",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Oui, je confirme !',
              cancelButtonText: 'Annuler'
            })
              .then(function(response) {
                if (response.dismiss != "cancel") {
                  Saisies.delete({
                    id: ctrl.saisie.id,
                    "onglets_ids[]": ctrl.onglet.ids
                  }).$promise
                    .then(function() {
                      ctrl.saisie.action = 'deleted';
                      ctrl.callback();
                    });
                }
              });
          };

          ctrl.$onInit = function() {
            ctrl.edition = ctrl.saisie.create_me;

            if (ctrl.saisie.create_me) {
              ctrl.new_saisie = true;
              ctrl.saisie.content = '';
              ctrl.saisie.tmp_pinned = false;
            } else {
              ctrl.saisie = new Saisies(ctrl.saisie);
              ctrl.saisie.tmp_pinned = ctrl.saisie.pinned;
            }
            ctrl.saisie.trusted_content = $sce.trustAsHtml(ctrl.saisie.content);

            User.get({ id: UID }).$promise
              .then(function(current_user) {
                ctrl.current_user = current_user;

                ctrl.editable = ctrl.new_saisie ||
                  (_(ctrl).has('onglet') && ctrl.onglet.writable && ctrl.saisie.uid_author == ctrl.current_user.id) ||
                  ctrl.current_user.is_admin();
              });

            ctrl.toolbar_id = ctrl.new_saisie ? (Math.random() * 2048) + "" : ctrl.saisie.id;
          };

          ctrl.$onChanges = function(changes) {
            ctrl.saisie.trusted_content = $sce.trustAsHtml(ctrl.saisie.content);
          };
        }],
                   template: `
                   <div class="panel panel-default saisie-display" ng:class="{'new-saisie': $ctrl.new_saisie}">
                     <span style="position: absolute; top: 0; right: 15px;height: 0;width: 0;text-align: center; color: #fff; border-color: transparent #fa0 transparent transparent;border-style: solid;border-width: 0 50px 50px 0; z-index: 1;"
                           ng:if="$ctrl.saisie.tmp_pinned">
                       <span class="glyphicon glyphicon-pushpin" style="margin-left: 25px;font-size: 22px;margin-top: 3px;"></span>
                     </span>

                     <div class="panel-heading" ng:if="$ctrl.saisie.id && !$ctrl.saisie.tmp_pinned">
                       <user-details class="col-md-4"
                                     ng:if="!$ctrl.saisie.new_saisie"
                                     uid="$ctrl.saisie.uid_author"
                                     small="true"
                                     show-avatar="true"></user-details>
                       {{$ctrl.saisie.ctime | date:'medium'}}
                       <div class="clearfix"></div>
                     </div>

                     <div class="panel-body" ng:style="{'padding': $ctrl.new_saisie ? 0 : 'inherit', 'border': $ctrl.new_saisie ? 0 : 'inherit'}">

                       <div class="col-md-12"
                            ta-bind
                            ng:model="$ctrl.saisie.trusted_content"
                            ng:if="!$ctrl.edition"></div>

                       <div class="col-md-12"
                            ng:style="{'padding': $ctrl.new_saisie ? 0 : 'inherit'}"
                            ng:if="$ctrl.edition">
                         <text-angular ta:target-toolbars="main-ta-toolbar-{{$ctrl.toolbar_id}}"
                                       ng:model="$ctrl.saisie.content"
                                       ng:change="$ctrl.dirty = true"></text-angular>
                         <div class="suivi-ta-toolbar gris2-moins">
                           <text-angular-toolbar class="pull-left"
                                                 style="margin-left: 0;"
                                                 name="main-ta-toolbar-{{$ctrl.toolbar_id}}"></text-angular-toolbar>

                           <button class="btn" style="margin-left: 6px;"
                                   ng:model="$ctrl.saisie.tmp_pinned"
                                   ng:change="$ctrl.dirty = true"
                                   ng:class="{'btn-warning': $ctrl.saisie.tmp_pinned, 'btn-default': !$ctrl.saisie.tmp_pinned}"
                                   uib:btn-checkbox
                                   btn:checkbox-true="true"
                                   btn:checkbox-false="false">
                             <span class="glyphicon glyphicon-pushpin" ></span> Épingler
                           </button>

                           <button class="btn btn-success pull-right"
                                   ng:disabled="!$ctrl.dirty || !$ctrl.onglet"
                                   ng:click="$ctrl.save()">
                             <span class="glyphicon glyphicon-save" ></span> Publier
                           </button>
                           <button class="btn btn-default pull-right"
                                   ng:click="$ctrl.cancel()"
                                   ng:if="$ctrl.saisie.id">
                             <span class="glyphicon glyphicon-edit" ></span> Annuler
                           </button>

                           <button class="btn btn-danger pull-right"
                                   ng:click="$ctrl.delete()"
                                   ng:if="$ctrl.saisie.id && ( $ctrl.editable || $ctrl.current_user.is_admin() )">
                             <span class="glyphicon glyphicon-trash"></span> Supprimer
                           </button>
                           <div class="clearfix"></div>
                         </div>
                       </div>
                     </div>

                     <div class="panel-footer" ng:if="!$ctrl.edition">
                       <div class="pull-right buttons">
                         <button class="btn btn-default"
                                 ng:click="$ctrl.toggle_edit()"
                                 ng:if="$ctrl.editable">
                           <span class="glyphicon glyphicon-edit" ></span> Éditer
                         </button>
                       </div>
                       <div class="clearfix"></div>
                     </div>
                   </div>

`
    });