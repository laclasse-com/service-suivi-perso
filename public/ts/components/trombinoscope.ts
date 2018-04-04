angular.module('suiviApp')
  .component('trombinoscope',
    {
      controller: ['$filter', '$q', 'URL_ENT', 'APIs', 'Popups', 'User', 'UID',
        function($filter, $q, URL_ENT, APIs, Popups, User, UID) {
          let ctrl = this;

          ctrl.pretty_labels = {
            "CLS": "classe",
            "GRP": "groupe d'élèves",
            "GPL": "groupe libre"
          };

          ctrl.popup_onglet_batch = Popups.onglet_batch;
          ctrl.popup_batch = Popups.batch;
          ctrl.popup_onglet_batch_callback = function(feedback) { console.log(feedback); };

          ctrl.popup_publish_batch = Popups.publish_batch;

          ctrl.filters = {
            text: '',
            groups: [],
            grades: []
          };
          ctrl.only_display_relevant_to = false;
          ctrl.eleves = [];
          ctrl.groups = [];
          ctrl.structures = [];

          let fix_avatar_url = function(avatar_url) {
            return (_(avatar_url.match(/^(user|http)/)).isNull() ? `${URL_ENT}/` : '') + avatar_url;
          };

          ctrl.apply_filters = function() {
            let selected_structures_ids = _.chain(ctrl.structures).where({ selected: true }).pluck('id').value();
            let selected_groups_ids = _.chain(ctrl.groups).where({ selected: true }).pluck('id').value();
            let selected_grades_ids = _.chain(ctrl.grades).where({ selected: true }).pluck('id').value();
            let grades_ids_from_groups_ids = (groups_ids) => {
              return _.chain(ctrl.groups)
                .select((group) => { return _(groups_ids).contains(group.id) })
                .pluck("grades")
                .flatten()
                .pluck("grade_id")
                .uniq()
                .value();
            };
            let structures_ids_from_groups_ids = (groups_ids) => {
              return _.chain(ctrl.groups)
                .select((group) => { return _(groups_ids).contains(group.id) })
                .pluck("structure_id")
                .uniq()
                .value();
            };

            return function(pupil) {
              return `${pupil.firstname}${pupil.lastname}`.toLocaleLowerCase().includes(ctrl.filters.text.toLocaleLowerCase())
                && (selected_structures_ids.length == 0 || _(selected_structures_ids).intersection(structures_ids_from_groups_ids(_(pupil.groups).pluck('group_id'))).length > 0)
                && (selected_groups_ids.length == 0 || _(selected_groups_ids).intersection(_(pupil.groups).pluck('group_id')).length > 0)
                && (selected_grades_ids.length == 0 || _(selected_grades_ids).intersection(grades_ids_from_groups_ids(_(pupil.groups).pluck('group_id'))).length > 0)
                && (!ctrl.only_display_relevant_to || pupil.relevant)
            };
          };

          ctrl.clear_filters = function(type) {
            if (_(['CLS', 'GRP', 'GPL']).contains(type)) {
              _.chain(ctrl['groups']).select(function(item) { return item.selected && item.type == type; }).each(function(item) { item.selected = false; });
            } else {
              _(ctrl[type]).each(function(item) { item.selected = false; });
            }
          };

          ctrl.pluck_selected_uids = function() {
            var filter = ctrl.apply_filters();

            return _.chain(ctrl.eleves)
              .select(function(pupil) { return filter(pupil); })
              .reject(function(pupil) { return pupil.excluded; })
              .pluck('id')
              .value();
          };

          ctrl.pluriel = function(item_count, character) {
            return item_count > 1 ? character : '';
          }

          User.get({ id: UID }).$promise
            .then(function(response) {
              ctrl.current_user = response;

              ctrl.current_user.avatar = fix_avatar_url(ctrl.current_user.avatar);

              return APIs.query_carnets_relevant_to(ctrl.current_user.id);
            },
              function error(response) { })
            .then(function success(response) {
              ctrl.relevant_to = _(response.data).pluck('uid_eleve');

              return ctrl.current_user.get_actual_groups();
            },
              function error(response) { })
            .then(function(groups) {
              let users_ids = [];
              let promises = [];
              let process_groups = (groups) => {
                ctrl.groups = ctrl.groups.concat(_(groups).select((group) => { return group.type == "GPL" || _(group.users).findWhere({ type: "ELV" }) != undefined; }));
                ctrl.groups = _(ctrl.groups).uniq((structure) => groups.group_id)

                APIs.get_grades(_.chain(ctrl.groups)
                  .pluck('grades')
                  .flatten()
                  .pluck('grade_id')
                  .value())
                  .then(function success(response) {
                    ctrl.grades = response.data;
                  },
                    function error(response) { });

                users_ids = users_ids.concat(
                  _.chain(groups)
                    .pluck("users")
                    .flatten()
                    .compact()
                    .select((user) => user.type == "ELV")
                    .pluck("user_id")
                    .value()
                );
              };

              let process_structures_ids = (structures_ids) => {
                if (structures_ids.length > 1) {
                  APIs.get_structures(structures_ids).then((response) => {
                    ctrl.structures = ctrl.structures.concat(response.data);
                    ctrl.structures = _(ctrl.structures).uniq((structure) => structure.id)
                  });
                }
              };

              // user is a student
              if (_.chain(ctrl.current_user.profiles).pluck("type").contains("ELV").value()) {
                users_ids.push(ctrl.current_user.id);
              }

              // user has children
              users_ids = users_ids.concat(_(ctrl.current_user.children).pluck('child_id'));

              // user has groups
              let groups_ids = _.chain(groups)
                .reject((group) => { return _(["ELV"]).contains(group.type); })
                .pluck("id")
                .value();
              if (groups_ids.length > 0) {
                promises.push(
                  APIs.get_groups(groups_ids)
                    .then((response) => {
                      process_structures_ids(_.chain(response.data)
                        .pluck("structure_id")
                        .uniq()
                        .value());

                      process_groups(response.data);
                    })
                );
              }

              // user is able to see every student of given structure
              let structures_ids = _.chain(ctrl.current_user.profiles)
                .select((profile) => _(["ADM", "DIR", "DOC", "ETA", "EVS", "ORI"]).contains(profile.type))
                .pluck("structure_id")
                .uniq()
                .value();

              if (!_(structures_ids).isEmpty()) {
                process_structures_ids(structures_ids);

                promises.push(APIs.get_groups_of_structures(structures_ids)
                  .then(function(response) {
                    process_groups(response.data);
                  }));
              }

              // process users_ids
              $q.all(promises).then(() => {
                users_ids = _(users_ids).uniq();

                while (users_ids.length > 0) {
                  APIs.get_users(users_ids.splice(0, 200))
                    .then(function(users) {
                      ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function(eleve) {
                        eleve.avatar = fix_avatar_url(eleve.avatar);
                        eleve.excluded = false;
                        eleve.relevant = _(ctrl.relevant_to).contains(eleve.id);

                        let classe = _.chain(eleve.groups)
                          .map((group) => {
                            return _(ctrl.groups).findWhere({ id: group.group_id, type: "CLS" });
                          })
                          .compact()
                          .first()
                          .value();

                        if (classe != undefined) {
                          eleve.regroupement = {
                            id: classe.id,
                            name: classe.name,
                            type: classe.type
                          };
                          eleve.etablissement = classe.structure_id;
                          eleve.enseignants = classe.profs;
                        }

                        return eleve;
                      }));

                      ctrl.eleves = _(ctrl.eleves).uniq((eleve) => { return eleve.id; });
                    });
                }
              });
            });
        }],
      template: `
<style>
  .trombinoscope .petite.case { border: 1px solid transparent; }
  .filter .panel-body { max-height: 380px; overflow-y: auto; }
  .trombinoscope .excluded .eleve { opacity: 0.8; }
  .regroupement {background-color: rgba(240, 240, 240, 0.66);}
  .trombinoscope .excluded .eleve .full-name { color: lightgray; text-decoration: double line-through; }
</style>
<div class="col-md-4 gris1-moins aside trombinoscope-aside" style="padding: 0;">
  <div class="panel panel-default gris1-moins">
    <div class="panel-heading" style="text-align: right; ">
      <h3>
        {{$ctrl.pluck_selected_uids().length}} élève{{$ctrl.pluriel($ctrl.pluck_selected_uids().length, 's')}}<span ng:if="$ctrl.current_user.can_do_batch"> sélectionné{{$ctrl.pluriel($ctrl.filtered.length, 's')}}</span>

        <a class="btn btn-primary"
           title="Gestion des onglets communs"
           ng:if="$ctrl.current_user.can_do_batch"
           ui:sref="carnet({uids: $ctrl.pluck_selected_uids()})">
          <span class="glyphicon glyphicon-user"></span>
          <span class="glyphicon glyphicon-user" style="font-size: 125%; margin-left: -11px; margin-right: -11px;"></span>
          <span class="glyphicon glyphicon-user"></span>
        </a>
      </h3>
    </div>
    <div class="panel-body">

      <div class="row">
        <div class="col-md-12">
          <input class="form-control input-lg"
                 style="display: inline; background-color: rgba(240, 240, 240, 0.66);"
                 type="text" name="search"
                 ng:model="$ctrl.filters.text" />
          <button class="btn btn-xs" style="color: green; margin-left: -44px; margin-top: -4px;"
                  ng:click="$ctrl.filters.text = ''"
                  ng:disabled="$ctrl.filters.text.length == 0">
            <span class="glyphicon glyphicon-remove"></span>
          </button>
        </div>
      </div>

      <div class="row" style="margin-top: 14px;">
        <div class="col-md-6 filter"
             ng:repeat="grp_type in ['CLS', 'GRP', 'GPL']"
             ng:if="$ctrl.groups.length > 0">
          <div class="panel panel-default">
            <div class="panel-heading">
              Filtrage par {{$ctrl.pretty_labels[grp_type]}}

              <button class="btn btn-xs pull-right" style="color: green;"
                      ng:click="$ctrl.clear_filters( grp_type )">
                <span class="glyphicon glyphicon-remove">
                </span>
              </button>
              <div class="clearfix"></div>
            </div>

            <div class="panel-body">
              <div class="btn-group">
                <button class="btn btn-sm" style="margin: 2px; font-weight: bold; color: #fff;"
                        ng:repeat="group in $ctrl.groups | filter:{type: grp_type} | orderBy:['name']"
                        ng:class="{'vert-plus': group.selected, 'vert-moins': !group.selected}"
                        ng:model="group.selected"
                        uib:btn-checkbox>
                  {{group.name}}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 filter" ng:if="$ctrl.grades.length > 0">
          <div class="panel panel-default">
            <div class="panel-heading">
              Filtrage par niveau

              <button class="btn btn-xs pull-right" style="color: green;"
                      ng:click="$ctrl.clear_filters('grades')">
                <span class="glyphicon glyphicon-remove">
                </span>
              </button>
              <div class="clearfix"></div>
            </div>

            <div class="panel-body">
              <div class="btn-group">
                <button class="btn btn-sm" style="margin: 2px; font-weight: bold; color: #fff;"
                        ng:repeat="grade in $ctrl.grades | orderBy:['name']"
                        ng:class="{'vert-plus': grade.selected, 'vert-moins': !grade.selected}"
                        ng:model="grade.selected"
                        uib:btn-checkbox>
                  {{grade.name}}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 filter" ng:if="$ctrl.structures.length > 1">
          <div class="panel panel-default">
            <div class="panel-heading">
              Filtrage par établissements

              <button class="btn btn-xs pull-right" style="color: green;"
                      ng:click="$ctrl.clear_filters('structures')">
                <span class="glyphicon glyphicon-remove">
                </span>
              </button>
              <div class="clearfix"></div>
            </div>

            <div class="panel-body">
              <div class="btn-group">
                <button class="btn btn-sm" style="margin: 2px; font-weight: bold; color: #fff;"
                        ng:repeat="structure in $ctrl.structures | orderBy:['name']"
                        ng:class="{'vert-plus': structure.selected, 'vert-moins': !structure.selected}"
                        ng:model="structure.selected"
                        uib:btn-checkbox>
                  {{structure.name}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>

<div class="col-md-8 vert-moins damier trombinoscope">
  <ul>
    <li class="col-xs-6 col-sm-4 col-md-3 col-lg-2 petite case vert-moins"
        style="background-repeat: no-repeat; background-attachment: scroll; background-clip: border-box; background-origin: padding-box; background-position-x: center; background-position-y: center; background-size: 100% auto;"
        ng:class="{'relevant': eleve.relevant, 'excluded': eleve.excluded}"
        ng:style="{'background-image': 'url( {{eleve.avatar}} )' }"
        ng:repeat="eleve in $ctrl.filtered = ( $ctrl.eleves | filter:$ctrl.apply_filters() | orderBy:['regroupement.name', 'lastname'] )">
      <button class="btn btn-danger pull-left" style="height: 10%;"
              title="exclure de la sélection"
              ng:style="{'opacity': eleve.excluded ? '1' : '0.5'}"
              uib:btn-checkbox ng:model="eleve.excluded"
              ng:if="$ctrl.current_user.can_do_batch">
        <span class="glyphicon glyphicon-ban-circle"></span>
      </button>
      <h5 class="regroupement pull-right" style="height: 10%;">{{eleve.regroupement.name}}</h5>
      <a class="eleve" style="height: 90%; margin-top: 10%;"
         ui:sref="carnet({uids: [eleve.id]})">

        <div class="full-name" title="{{eleve.relevant ? 'Vous êtes contributeur de ce carnet' : ''}}">
          <h4 class="first-name">{{eleve.firstname}}</h4>
          <h4 class="last-name">{{eleve.lastname}}</h4>
        </div>
      </a>
    </li>
  </ul>
</div>
`
    });
