angular.module('suiviApp')
  .component('trombinoscope',
  {
    controller: ['$filter', '$q', 'URL_ENT', 'APIs', 'Popups', 'User',
      function($filter, $q, URL_ENT, APIs, Popups, User) {
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

        let fix_avatar_url = function(avatar_url) {
          return (_(avatar_url.match(/^(user|http)/)).isNull() ? `${URL_ENT}/` : '') + avatar_url;
        };

        ctrl.apply_filters = function() {
          var selected_groups_ids = _.chain(ctrl.groups).where({ selected: true }).pluck('id').value();
          var selected_grades_ids = _.chain(ctrl.grades).where({ selected: true }).pluck('id').value();

          return function(pupil) {
            // return ((pupil.lastname.toLocaleLowerCase().match(ctrl.filters.text.toLocaleLowerCase()) != null)
            //         || (pupil.firstname.toLocaleLowerCase().match(ctrl.filters.text.toLocaleLowerCase()) != null))
            return `${pupil.firstname}${pupil.lastname}`.toLocaleLowerCase().includes(ctrl.filters.text.toLocaleLowerCase())
              && (selected_groups_ids.length == 0 || _(selected_groups_ids).intersection(_(pupil.groups).pluck('group_id')).length > 0)
              && (selected_grades_ids.length == 0 || _(selected_grades_ids).intersection(_(pupil.regroupement.grades).pluck('grade_id')).length > 0)
              && (!ctrl.only_display_relevant_to || pupil.relevant)
            // && !pupil.excluded;
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

        User.get().$promise
          .then(function(response) {
            ctrl.current_user = response;

            ctrl.current_user.avatar = fix_avatar_url(ctrl.current_user.avatar);
            ctrl.can_do_batch = ctrl.current_user.can_do_batch;


            return APIs.query_carnets_relevant_to(ctrl.current_user.id);
          },
          function error(response) { })
          .then(function success(response) {
            ctrl.relevant_to = _(response.data).pluck('uid_eleve');

            return ctrl.current_user.get_actual_groups();
          },
          function error(response) { })
          .then(function(groups) {
            let classes = _(groups).where({ type: 'CLS' });
            let post_concat = () => {
              ctrl.eleves = _.chain(ctrl.eleves)
                .uniq((eleve) => { return eleve.id; })
                .each((eleve) => { eleve.excluded = false; })
                .value();

            };

            switch (ctrl.current_user.profil_actif.type) {
              case "ELV":
                ctrl.current_user.regroupement = { libelle: classes[0].name };
                ctrl.current_user.relevant = true;

                ctrl.eleves = [ctrl.current_user];

                ctrl.relevant_to = _(ctrl.relevant_to).reject(function(uid) { return uid == ctrl.current_user.id; });
                APIs.get_users(ctrl.relevant_to)
                  .then(function(users) {
                    ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function(eleve) {
                      eleve.avatar = fix_avatar_url(eleve.avatar);
                      eleve.relevant = true;

                      let groups_ids = _(eleve.groups).pluck('group_id');

                      if (!_(groups_ids).isEmpty()) {
                        APIs.get_groups(groups_ids)
                          .then(function(response) {
                            let regroupement = _(response.data).findWhere({ type: 'CLS' });

                            if (!_(regroupement).isUndefined()) {
                              eleve.regroupement = {
                                id: regroupement.id,
                                name: regroupement.name,
                                type: regroupement.type
                              };
                              eleve.etablissement = regroupement.structure_id;
                              eleve.enseignants = regroupement.profs;
                            }
                          });
                      }

                      return eleve;
                    }))
                  })
                  .then(post_concat);
                break;

              case "TUT":
                let users_ids = _(ctrl.current_user.children).pluck('child_id');

                if (!_(users_ids).isEmpty()) {
                  APIs.get_users(users_ids)
                    .then(function(users) {
                      ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function(eleve) {
                        eleve.avatar = fix_avatar_url(eleve.avatar);
                        let groups_ids = _(eleve.groups).pluck('group_id');

                        if (!_(groups_ids).isEmpty()) {
                          APIs.get_groups(groups_ids)
                            .then(function(response) {
                              let regroupement = _(response.data).findWhere({ type: 'CLS' });

                              if (!_(regroupement).isUndefined()) {
                                eleve.regroupement = {
                                  id: regroupement.id,
                                  name: regroupement.name,
                                  type: regroupement.type
                                };
                                eleve.etablissement = regroupement.structure_id;
                                eleve.enseignants = regroupement.profs;
                              }
                            });
                        }

                        return eleve;
                      }));
                    })
                    .then(post_concat);
                }
                break;

              default:
                APIs.get_groups(_.chain(groups)
                  .select(function(regroupement) {
                    return _(regroupement).has('structure_id') && regroupement.structure_id === ctrl.current_user.profil_actif.structure_id;
                  })
                  .pluck('id')
                  .uniq()
                  .value())
                  .then(function success(response) {
                    ctrl.groups = response.data;
                    ctrl.eleves = [];

                    APIs.get_grades(_.chain(response.data)
                      .pluck('grades')
                      .flatten()
                      .pluck('grade_id')
                      .value())
                      .then(function success(response) {
                        ctrl.grades = response.data;
                      },
                      function error(response) { });

                    _(response.data).each(function(regroupement) {
                      regroupement.profs = _.chain(regroupement.users).select(function(user) { return user.type === 'ENS'; }).pluck('user_id').value();
                      let users_ids = _.chain(regroupement.users).select(function(user) { return user.type === 'ELV'; }).pluck('user_id').value();

                      APIs.get_users(users_ids)
                        .then(function(users) {
                          ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function(eleve) {
                            eleve.avatar = fix_avatar_url(eleve.avatar);

                            eleve.relevant = _(ctrl.relevant_to).contains(eleve.id);
                            eleve.regroupement = regroupement;
                            eleve.etablissement = regroupement.structure_id;
                            eleve.enseignants = regroupement.profs;

                            return eleve;
                          }))
                        });
                    });
                  },
                  function error(response) { })
                  .then(post_concat);
            }
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
        {{$ctrl.pluck_selected_uids().length}} élève{{$ctrl.pluriel($ctrl.pluck_selected_uids().length, 's')}} sélectionné{{$ctrl.pluriel($ctrl.filtered.length, 's')}}

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
        <div class="col-md-6 filter" ng:repeat="grp_type in ['CLS', 'GRP', 'GPL']" ng:if="$ctrl.groups.length > 0">
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
