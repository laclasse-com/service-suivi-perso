angular.module('suiviApp')
  .component('droits',
    {
      bindings: {
        uidEleve: '<',
        droits: '=',
        concernedPeople: '<'
      },
      controller: ['Droits', 'APIs', 'UID', 'URL_ENT', 'User',
        function(Droits, APIs, UID, URL_ENT, User) {
          let ctrl = this;
          ctrl.sharing_enabled = false;

          let gen_pseudo_UUID = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          };

          ctrl.add = function(droit) {
            droit.new = true;
            droit.dirty = {
              uid: false,
              profile_type: false,
              group_id: false,
              sharable_id: false,
              read: false,
              write: false,
              manage: false
            };

            ctrl.droits.push(new Droits(droit));
          };

          ctrl.add_sharable = function(droit) {
            droit.sharable_id = gen_pseudo_UUID();
            ctrl.add(droit);
          };

          let maybe_init_dirtiness = function(droit) {
            if (!_(droit).has('dirty')) {
              droit.dirty = {
                uid: false,
                profile_type: false,
                group_id: false,
                sharable_id: false,
                read: false,
                write: false,
                manage: false
              };
            }
          };

          ctrl.set_read = function(droit) {
            maybe_init_dirtiness(droit);

            droit.dirty.read = true;

            if (!droit.read && droit.write) {
              droit.write = false;
              droit.dirty.write = true;
            }

            if (!droit.read && droit.manage) {
              droit.manage = false;
              droit.dirty.manage = true;
            }
          };

          ctrl.set_write = function(droit) {
            maybe_init_dirtiness(droit);

            droit.dirty.write = true;

            if (droit.write && !droit.read) {
              droit.read = true;
              droit.dirty.read = true;
            }

            if (!droit.write && droit.manage) {
              droit.manage = false;
              droit.dirty.manage = true;
            }
          };

          ctrl.set_manage = function(droit) {
            maybe_init_dirtiness(droit);

            droit.dirty.manage = true;

            if (droit.manage && !droit.write) {
              droit.write = true;
              droit.dirty.write = true;
            }

            if (droit.manage && !droit.read) {
              droit.read = true;
              droit.dirty.read = true;
            }
          };

          ctrl.update_deletabilities = function() {
            ctrl.droits.forEach(function(droit) {
              droit.deletable = droit.uid != UID;
              if (ctrl.uidEleve != undefined) {
                droit.deletable = droit.deletable && droit.uid != ctrl.uidEleve;
              }
            });
          };

          ctrl.$onInit = function() {
            ctrl.UID = UID;

            ctrl.update_deletabilities();

            APIs.query_profiles_types()
              .then(function success(response) {
                ctrl.profils = response.data;
              },
                function error(response) { });

            User.get({ id: UID }).$promise
              .then(function success(current_user) {
                return current_user.get_actual_groups();
              })
              .then(function success(response) {
                ctrl.groups = response.filter(function(group) { return group.type == "GPL"; })
                  .map(function(group) {
                    let types = { CLS: "Classes", GRP: "Groupes d'élèves", GPL: "Groupes libres" };
                    group.type = types[group.type];

                    return group;
                  });
              },
                function error(response) { });
          };
        }],
      template: `
                            <div>
                              <label>Gestion des droits</label>
                              <table style="width: 100%;">
                                <tr style="text-align: right;"
                                    ng:repeat="droit in $ctrl.droits"
                                    ng:if="ctrl.sharing_enabled || !droit.sharable_id">
                                  <td>
                                    <label ng:if="droit.uid">Personne :
                                      <select style="width: 250px;"
                                              ng:model="droit.uid"
                                              ng:change="droit.dirty.uid = true"
                                              ng:disabled="droit.to_delete"
                                              ng:options="people.id as people.firstname + ' ' + people.lastname group by people.type for people in $ctrl.concernedPeople">
                                      </select>
                                    </label>

                                    <label ng:if="droit.profile_type">Profil :
                                      <select style="width: 250px;"
                                              ng:model="droit.profile_type"
                                              ng:change="droit.dirty.profile_type = true"
                                              ng:disabled="droit.to_delete">
                                        <option ng:repeat="profil in $ctrl.profils track by profil.id"
                                                ng:value="profil.id">{{profil.name}}</option>
                                      </select>
                                    </label>

                                    <label ng:if="droit.group_id">Groupe :
                                      <select style="width: 250px;"
                                              ng:model="droit.group_id"
                                              ng:change="droit.dirty.group_id = true"
                                              ng:disabled="droit.to_delete"
                                              ng:options="group.id as group.name group by group.type for group in $ctrl.groups">
                                      </select>
                                    </label>

                                    <label ng:if="droit.sharable_id">Partage :
                                      <input style="width: 250px;"
                                             type="text"
                                             ng:model="droit.sharable_id"
                                             ng:change="droit.dirty.sharable_id = true"
                                             ng:disabled="droit.to_delete" />
                                    </label>
                                  </td>
                                  <td>
                                    <button type="button" class="btn"
                                            ng:class="{'btn-default': !droit.read, 'btn-success': droit.read}"
                                            ng:model="droit.read"
                                            ng:change="$ctrl.set_read( droit )"
                                            ng:disabled="droit.to_delete || droit.sharable_id"
                                            uib:btn-checkbox
                                            btn-checkbox-true="true"
                                            btn-checkbox-false="false"
                                            uib:tooltip="droit de lecture">
                                      <span class="glyphicon glyphicon-eye-open"></span>
                                    </button>
                                  </td>
                                  <td>
                                    <button type="button" class="btn"
                                            ng:class="{'btn-default': !droit.write, 'btn-success': droit.write}"
                                            ng:model="droit.write"
                                            ng:change="$ctrl.set_write( droit )"
                                            ng:disabled="droit.to_delete || droit.sharable_id"
                                            uib:btn-checkbox
                                            btn-checkbox-true="true"
                                            btn-checkbox-false="false"
                                            uib:tooltip="droit d'écriture">
                                      <span class="glyphicon glyphicon-edit"></span>
                                    </button>
                                  </td>
                                  <td>
                                    <button type="button" class="btn"
                                            ng:class="{'btn-default': !droit.manage, 'btn-success': droit.manage}"
                                            ng:model="droit.manage"
                                            ng:change="$ctrl.set_manage( droit )"
                                            ng:disabled="droit.to_delete || droit.sharable_id"
                                            uib:btn-checkbox
                                            btn-checkbox-true="true"
                                            btn-checkbox-false="false"
                                            uib:tooltip="droit d'administration">
                                      <span class="glyphicon glyphicon-cog"></span>
                                    </button>
                                  </td>
                                  <td>
                                    <button type="button" class="btn"
                                            ng:class="{'btn-default': !droit.to_delete, 'btn-warning': droit.to_delete}"
                                            ng:disabled="!droit.deletable && !droit.to_delete"
                                            ng:model="droit.to_delete"
                                            ng:change="$ctrl.update_deletabilities()"
                                            uib:btn-checkbox
                                            btn-checkbox-true="true"
                                            btn-checkbox-false="false">
                                      <span class="glyphicon glyphicon-trash"></span>
                                    </button>
                                  </td>
                                </tr>
                                <tfoot>
                                  <td colspan="3">
                                    <button class="btn btn-default"
                                            ng:click="$ctrl.add({ uid: '...', read: true, write: true })">
                                      <span class="glyphicon glyphicon-plus-sign"></span> par personne
                                    </button>

                                    <button class="btn btn-default"
                                            ng:click="$ctrl.add({ profile_type: '...', read: true, write: false })">
                                      <span class="glyphicon glyphicon-plus-sign"></span> par profil
                                    </button>

                                    <button class="btn btn-default"
                                            ng:click="$ctrl.add({ group_id: '...', read: true, write: false })"
                                            ng:if="$ctrl.groups.length > 0">
                                      <span class="glyphicon glyphicon-plus-sign"></span> par groupe
                                    </button>

                                    <button class="btn btn-warning pull-right"
                                            ng:if="ctrl.sharing_enabled"
                                            ng:click="$ctrl.add_sharable({ read: true, write: false })">
                                      <span class="glyphicon glyphicon-plus-sign"></span> partage
                                    </button>
                                  </td>
                                </tfoot>
                              </table>
                            </div>
`
    });
